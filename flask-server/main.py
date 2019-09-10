import time
from celery import Celery
from flask import Flask
import subprocess

celery_port='6666'
app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:{}/0'.format(celery_port)
app.config['CELERY_RESULT_BACKEND'] = \
    'redis://localhost:{}/0'.format(celery_port)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

app = Flask(__name__)


def test_answer():
    print('test')

@celery.task
def my_background_task(arg1, arg2):
    # some long running task here
    print('hello celery')
    time.sleep(2)
    test_answer()

@app.route('/')
def hello_world():
    task = my_background_task.delay(0, 0)
    return 'Running celery task in background... World!', 200


if __name__ == "__main__": 
    app.run(debug=True, host="0.0.0.0")
