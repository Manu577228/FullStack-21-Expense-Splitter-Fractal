import json
import time
from confluent_kafka import Producer
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from groups.models import OutboxEvent


class Command(BaseCommand):
    help = "Publishes unpublished outbox rows to Kafka"

    def handle(self, *args, **opts):
        p = Producer({
            "bootstrap.servers": settings.KAFKA_BOOTSTRAP,
            "enable.idempotence": True,
            "acks": "all",
        })
        self.stdout.write("Outbox relay started")
        while True:
            with transaction.atomic():
                batch = list(
                    OutboxEvent.objects.select_for_update(skip_locked=True)
                    .filter(published=False).order_by("id")[:100]
                )
                for e in batch:
                    p.produce(
                        e.topic,
                        key=e.key,
                        value=json.dumps({**e.payload, "event_id": str(e.event_id)}),
                    )
                if batch:
                    p.flush()
                    OutboxEvent.objects.filter(
                        id__in=[e.id for e in batch]
                    ).update(published=True)
                    self.stdout.write(f"Published {len(batch)} event(s)")
            if not batch:
                time.sleep(0.5)
