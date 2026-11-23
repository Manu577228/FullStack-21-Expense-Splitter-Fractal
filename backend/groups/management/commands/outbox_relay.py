
import json
import time

from confluent_kafka import Producer
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from groups.models import OutboxEvent


class Command(BaseCommand):
    help = "Publishes unpublished outbox rows to Kafka"

    def add_arguments(self, parser):
        parser.add_argument(
            "--once",
            action="store_true",
            help="Process pending events and exit",
        )

    def handle(self, *args, **opts):
        config = {
            "bootstrap.servers": settings.KAFKA_BOOTSTRAP,
            "enable.idempotence": True,
            "acks": "all",
            "message.timeout.ms": 30000,
        }

        if settings.KAFKA_SECURITY_PROTOCOL == "SASL_SSL":
            config.update({
                "security.protocol": "SASL_SSL",
                "sasl.mechanism": settings.KAFKA_SASL_MECHANISM,
                "sasl.username": settings.KAFKA_USERNAME,
                "sasl.password": settings.KAFKA_PASSWORD,
                "ssl.ca.location": str(settings.BASE_DIR / "ca.pem"),
            })

        producer = Producer(config)

        once = opts["once"]

        self.stdout.write("Outbox relay started")

        try:
            while True:
                with transaction.atomic():
                    batch = list(
                        OutboxEvent.objects
                        .select_for_update(skip_locked=True)
                        .filter(published=False)
                        .order_by("id")[:100]
                    )

                    if batch:
                        errors = []

                        def delivery_report(err, msg):
                            if err is not None:
                                errors.append(str(err))

                        for event in batch:
                            producer.produce(
                                event.topic,
                                key=event.key,
                                value=json.dumps({
                                    **event.payload,
                                    "event_id": str(event.event_id),
                                }),
                                on_delivery=delivery_report,
                            )

                        remaining = producer.flush(35)

                        if remaining or errors:
                            raise CommandError(
                                "Kafka delivery failed: "
                                + (
                                    "; ".join(errors)
                                    if errors
                                    else f"{remaining} messages pending"
                                )
                            )

                        OutboxEvent.objects.filter(
                            id__in=[event.id for event in batch]
                        ).update(published=True)

                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Published {len(batch)} event(s)"
                            )
                        )

                if once:
                    if len(batch) < 100:
                        self.stdout.write(
                            "Outbox relay completed"
                        )
                        break
                    continue

                if not batch:
                    time.sleep(0.5)

        except KeyboardInterrupt:
            self.stdout.write("Outbox relay stopped")
