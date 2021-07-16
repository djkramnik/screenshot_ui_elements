import boto3
from pathlib import Path
import os

dir_name = Path(__file__).resolve().parent
local_path = os.path.join(dir_name, '../screenshots/browserdaemon_signup=1:button/downloaded.zip')

s3 = boto3.client('s3')
s3.download_file('ui-dataset', 'screenshots/testink.zip', local_path)