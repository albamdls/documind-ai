from app.tasks.celery_app import celery


@celery.task
def ping_task() -> str:
    return "pong"