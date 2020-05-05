# DevOps Terraform NodeJS API
A demo of various technologies by [Matt Bailey (Senior DevOps Engineer)](https://www.linkedin.com/in/matt-bailey-8bab1862/)


## Run the node api locally

### Install dependecies:
`npm install`

### Run local server:
`node src/`

### Preinitialisation:
Creates settings for a user 1234.
`PUT` to `localhost:3001/terraform/preinit/1234`

### Setup your backend:
Created a backend configuration for user 1234.
`PUT` to `localhost:3001/terraform/backend/1234`

### Setup Provisioners:
Sets up provisioners for user 1234.
`POST` to `localhost:3001/terraform/provisioner/1234`

Body:
```
{
    "provisionerSettings": {
        "accessKey": "youraccesskey",
        "secretKey": "yoursecretkey",
        "region": "eu-west-2"
    }
}
```

### Create first module:
This example creates a VPC using a terraform registry module for user 1234.

`POST` to `localhost:3001/terraform/module/1234`

Body:
```
{
    "moduleSettings": {
        "name": "vpc",
        "type": "terraform-aws-modules/vpc/aws",
        "variables": {
            "name": "my-vpc",
            "cidr":"10.0.0.0/16",
            "azs": ["eu-west-1a", "eu-west-1b", "eu-west-1c"],
            "private_subnets": ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
            "public_subnets": ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"],
            "enable_nat_gateway": true,
            "enable_vpn_gateway": true
        }
        
    }
}
```
### Initialise terraform 
This will download modules/providers needed to run terraform for user 1234.

`PUT` to `localhost:3001/terraform/init/1234`



### Run a terraform plan
This will plan a build based on all modules currently created.

`GET` to `localhost:3001/terraform/plan/1234`

This will return JSON of the plan results.