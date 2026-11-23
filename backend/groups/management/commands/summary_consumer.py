import json
from confluent_kafka import Consumer
from django.conf import settings
from django.core.management.base import BaseCommand
from groups.services import apply_event


class Command(BaseCommand):
    help = "Consumes expense events and updates GroupSummary"

    def handle(self, *args, **opts):
        c = Consumer({
            "bootstrap.servers": settings.KAFKA_BOOTSTRAP,
            "group.id": "summary-builder",
            "enable.auto.commit": False,
            "auto.offset.reset": "earliest",
        })
        c.subscribe(["expense-events"])
        self.stdout.write("Summary consumer started")
        while True:
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                self.stderr.write(str(msg.error()))
                continue
            apply_event(json.loads(msg.value()))
            c.commit(msg)  # commit only after the DB write succeeds
