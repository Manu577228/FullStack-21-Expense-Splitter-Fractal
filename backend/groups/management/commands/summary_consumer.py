
import json
import time

from confluent_kafka import Consumer
from django.conf import settings
from django.core.management.base import BaseCommand

from groups.services import apply_event


class Command(BaseCommand):
    help = "Consumes expense events and updates GroupSummary"

    def add_arguments(self, parser):
        parser.add_argument(
            "--once",
            action="store_true",
            help="Consume available events for a limited time and exit",
        )

    def handle(self, *args, **opts):
        config = {
            "bootstrap.servers": settings.KAFKA_BOOTSTRAP,
            "group.id": "summary-builder",
            "enable.auto.commit": False,
            "auto.offset.reset": "earliest",
        }

        if settings.KAFKA_SECURITY_PROTOCOL == "SASL_SSL":
            config.update({
                "security.protocol": "SASL_SSL",
                "sasl.mechanism": settings.KAFKA_SASL_MECHANISM,
                "sasl.username": settings.KAFKA_USERNAME,
                "sasl.password": settings.KAFKA_PASSWORD,
                "ssl.ca.location": str(settings.BASE_DIR / "ca.pem"),
            })

        consumer = Consumer(config)
        once = opts["once"]

        # Allow enough time for Kafka group assignment.
        # Exit after 10 seconds without messages, or 60 seconds total.
        idle_timeout = 10
        max_runtime = 60

        start_time = time.monotonic()
        last_message_time = start_time

        try:
            consumer.subscribe(["expense-events"])

            self.stdout.write(
                self.style.SUCCESS("Summary consumer started")
            )

            while True:
                msg = consumer.poll(1.0)

                if msg is None:
                    if once:
                        now = time.monotonic()

                        if (
                            now - last_message_time >= idle_timeout
                            or now - start_time >= max_runtime
                        ):
                            break
                    continue

                if msg.error():
                    self.stderr.write(str(msg.error()))
                    continue

                last_message_time = time.monotonic()

                try:
                    event = json.loads(msg.value())

                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    self.stderr.write(
                        f"Skipping invalid JSON message: {e}"
                    )

                    consumer.commit(
                        message=msg,
                        asynchronous=False,
                    )
                    continue

                apply_event(event)

                consumer.commit(
                    message=msg,
                    asynchronous=False,
                )

                self.stdout.write(
                    f"Processed event from partition "
                    f"{msg.partition()}, offset {msg.offset()}"
                )

                if once and time.monotonic() - start_time >= max_runtime:
                    break

            if once:
                self.stdout.write(
                    self.style.SUCCESS("Summary consumer completed")
                )

        except KeyboardInterrupt:
            self.stdout.write("Summary consumer stopped")

        finally:
            consumer.close()
