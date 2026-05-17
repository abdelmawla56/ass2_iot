import json
import boto3
import os

# Initialize SNS client
sns_client = boto3.client('sns')

# Read SNS Topic ARN from environment variables
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')

def lambda_handler(event, context):
    """
    AWS Lambda function triggered by IoT Core Rule.
    Processes telemetry data and sends an SNS alert if risk level is HIGH or CRITICAL.
    """
    print("Received event:", json.dumps(event))
    
    device_id = event.get('device_id', 'Unknown Device')
    risk_level = event.get('risk_level', 'LOW')
    temperature = event.get('temperature', 'N/A')
    humidity = event.get('humidity', 'N/A')
    leaf_wetness = event.get('leaf_wetness', 'N/A')
    
    if risk_level in ['HIGH', 'CRITICAL']:
        subject = f"CropGuard Alert: {risk_level} Disease Risk Detected"
        
        message = (
            f"URGENT ALERT: {risk_level} disease risk detected on {device_id}.\n\n"
            f"Current Conditions:\n"
            f"- Temperature: {temperature}°C\n"
            f"- Humidity: {humidity}%\n"
            f"- Leaf Wetness: {leaf_wetness} hours\n\n"
            f"Please take immediate preventive action (e.g., apply fungicide)."
        )
        
        try:
            response = sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message,
                Subject=subject
            )
            print(f"Alert sent successfully. MessageId: {response['MessageId']}")
        except Exception as e:
            print(f"Error sending SNS alert: {e}")
            raise e
            
    return {
        'statusCode': 200,
        'body': json.dumps('Processing complete')
    }
