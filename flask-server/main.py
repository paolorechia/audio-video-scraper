import os
import time
from celery import Celery
from flask import Flask, request
from werkzeug.exceptions import HTTPException
import subprocess

DISK_ONE_DEVICE='/dev/sda1'
DISK_ONE_ROOT='/home/paolo/HDD'
VIDEO_PATH='audio_video_scraping/youtube'
OUTPUT_DIR=os.path.join(DISK_ONE_ROOT, VIDEO_PATH)

# TODO:
# get_disk_mount_point()

celery_port='6666'
app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:{}/0'.format(celery_port)
app.config['CELERY_RESULT_BACKEND'] = \
    'redis://localhost:{}/0'.format(celery_port)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

app = Flask(__name__)

class BadRequest(HTTPException):
    code = 400
    message = 'Directory for link already exists!'

@celery.task
def download_video(youtube_link):
    output_template = '{}/%(title)s.%(ext)s'.format(OUTPUT_DIR)
    subprocess.run(['youtube-dl', '--all-subs', youtube_link, '-o',\
                    output_template],\
                    capture_output=True)
    
@celery.task
def my_background_task(arg1, arg2):
    # some long running task here
    print('hello celery')
    time.sleep(2)

@app.route('/download', methods=['POST'])
def download_youtube_video_in_background():
    json = request.get_json()
    link = json['link']
    task = download_video.delay(link)
    return 'Downloading video in background...!', 200

@app.route('/')
def hello_world():
    task = my_background_task.delay(0, 0)
    return 'Running celery task in background... World!', 200



if __name__ == "__main__": 
    app.run(debug=True, host="0.0.0.0")
