
Table of contents
Tasks
Create a Terraform script with Blocks and Resources.
Create a resource Block for an nginx docker image.
Create a resource Block for running a docker container for Nginx
#trainwithshubham # 90DaysOf DevopsChallenge #devops/terraform

Terraform needs to be told which provider to be used in the automation, hence we need to give the provider name with source and version. For Docker, we can use this block of code in the main.tf

Tasks
Create a Terraform script with Blocks and Resources.
Create a resource Block for an nginx docker image.
Create a resource Block for running a docker container for Nginx
Step 1:

As a first step Create an EC2 instnace on AWS and update your system.

Then Install docker in your server as docker is required to perform the all steps with terraform.



Then add your current user to the docker group and reboot your system.



Step 2:

Create a directory and go inside that directory, then create two files to write the terraform configuration scripts.

For better understanding, I have created the providers.tf, or you can write the whole script in the main.tf file. But while working in real time it's always best practice to structure your files in a better way.



Step 3:

Now, define your provider here.As we are provisioning terraform with docker so here provider will be docker.


COPY
provider "docker" {}


Step 4:

Write this terraform block to your main.tf file.

The terraform {} block contains Terraform settings, including the required providers Terraform will use to provision your infrastructure. For each provider, the source attribute defines an optional hostname, a namespace, and the provider type. Terraform installs providers from the Terraform Registry by default. In this example configuration, the docker provider's source is defined as kreuzwerker/docker, which is shorthand for registry.terraform.io/kreuzwerker/docker.te.. { required_providers { docker = { source = "kreuzwerker/docker" version = "~> 3.0.1" } } }


COPY
terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}


Step 5:

Now, it's time to create the resource block for the docker image and container. There will be two resource blocks, one for creating the image and another one for container creation from that image.

As an example, we will create an Nginx image and then an Nginx container.

Resource blocks have two strings before the block: the resource type and the resource name. In this example, the first resource type is docker_image and the name is nginx. The prefix of the type maps to the name of the provider. In the example configuration, Terraform manages the docker_image resource with the docker provider.


COPY
resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}


Step 6:

the resource type and resource name form a unique ID for the resource. For example, the ID for your Docker image is docker_image.nginx.


COPY
resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "tutorial"
  ports {
    internal = 80     #nginx default port is 80
    external = 80     ## host port
  }
}


This is the whole main.tf file.



Step 7:

Now, initialize the provider plugins, for that run terraform init command.



providers get installed inside of this .terraform folder.



Step 8:

When you will run the terraform plan command, terraform will read all the files within the directory and will give a plan format which will get created after executing the terraform apply command.

If you made any mistakes in the code then it will through an error.



Step 9:

Run terraform apply the command to get the final stage, image and container created successfully.



Step 10:

The Docker nginx container is running.



Allow port 80 to the inbound rule of your security group.



This is how you can create docker images and containers with the help of Terraform...

