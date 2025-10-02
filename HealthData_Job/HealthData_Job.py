import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsgluedq.transforms import EvaluateDataQuality
 
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)







 
# Default ruleset used by all target nodes with data quality enabled
DEFAULT_DATA_QUALITY_RULESET = """
    Rules = [
        ColumnCount > 0
    ]
"""
 
# Script generated for node AWS Glue Data Catalog
AWSGlueDataCatalog_node1758646690394 = glueContext.create_dynamic_frame.from_catalog(database="test1", table_name="hsraw_psu_health_data", transformation_ctx="AWSGlueDataCatalog_node1758646690394")
 
# Script generated for node Drop Fields
DropFields_node1758646875783 = DropFields.apply(frame=AWSGlueDataCatalog_node1758646690394, paths=["addiction medicine40 to 59femalepatient visits"], transformation_ctx="DropFields_node1758646875783")
 
# Script generated for node Amazon S3
EvaluateDataQuality().process_rows(frame=DropFields_node1758646875783, ruleset=DEFAULT_DATA_QUALITY_RULESET, publishing_options={"dataQualityEvaluationContext": "EvaluateDataQuality_node1758646672261", "enableDataQualityResultsPublishing": True}, additional_options={"dataQualityResultsPublishing.strategy": "BEST_EFFORT", "observations.scope": "ALL"})
AmazonS3_node1758646905808 = glueContext.write_dynamic_frame.from_options(frame=DropFields_node1758646875783, connection_type="s3", format="csv", connection_options={"path": "s3://hos-data-hs/etl-output/", "compression": "snappy", "partitionKeys": []}, transformation_ctx="AmazonS3_node1758646905808")
 
job.commit()
