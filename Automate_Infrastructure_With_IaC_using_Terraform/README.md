# Automate Infrastructure with IaC using Terraform

This project automates the creation of an AWS Virtual Private Cloud (VPC) and associated public subnets using Terraform. The infrastructure scales dynamically based on the number of availability zones or a user-specified count.

## Project Structure
```
.
├── main.tf            # Core Terraform configuration file
├── variables.tf       # Variables definitions
├── terraform.tfvars   # Custom variable values (optional)
├── README.md          # Project documentation
```

## Prerequisites
- Terraform installed
- AWS CLI configured
- Active AWS account

## Prerequisites before you begin writing Terraform code


- Create an IAM user, name it `terraform` (ensure that the user has only programatic access to your AWS account) and grant this user `AdministratorAccess` permissions.

Search IAM > Users > Create user > Attach policies directly

- Copy the secret access key and access key ID. Save them in a notepad temporarily.

  - Create the Access Key
 
  - Copy the secret access key and access key ID
![Screenshot 2024-12-13 053355](https://github.com/user-attachments/assets/60053173-748a-4f1e-9d23-57ce92796460)

![Screenshot 2024-12-13 053721](https://github.com/user-attachments/assets/9f44574b-72dd-4e13-972a-511d565a9168)

![Screenshot 2024-12-13 053757](https://github.com/user-attachments/assets/d893d688-e2e1-4c51-92eb-aa0a9c9d0e73)

- Configure programmatic access from your workstation to connect to AWS using the access keys copied above and a [Python SDK (boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html). You must have [Python 3.6](https://www.python.org/downloads/) or higher on your workstation.

For easier authentication configuration - use [AWS CLI](https://aws.amazon.com/cli/) with `aws configure` command.

```bash
aws configure
```

Fill in the prompt

```bash
AWS Access Key ID [****************Y6JW]: <Access Key ID>
AWS Secret Access Key [****************YdPL]: <Secret Acess Key>
Default region name [us-east-1]: us-east-1
Default output format [json]: json
```
```bash
cat ~/.aws/credentials

# You will see the output below
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```
__Install boto3__

![Screenshot 2024-12-13 055234](https://github.com/user-attachments/assets/b737a0e5-9051-4f61-8053-89e590042985)
![Screenshot 2024-12-13 055405](https://github.com/user-attachments/assets/cf5c60f4-10a0-426b-8e47-86f38b74515a)
![Screenshot 2024-12-13 055535](https://github.com/user-attachments/assets/980ea0d2-aa11-4cf2-b52e-004eb8299d27)

- Create an [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) to store Terraform state file. You can name it something like <yourname>-dev-terraform-bucket (Note: S3 bucket names must be unique within a region partition, you can read about S3 bucken naming [in this article](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)). We will use this bucket from `Project-17` onwards.

![Screenshot 2024-12-15 002802](https://github.com/user-attachments/assets/69d83303-ec70-43ff-aae8-02d9854dd5dd)
![Screenshot 2024-12-15 003148](https://github.com/user-attachments/assets/76d3a091-f73f-415c-9a78-e8636ddbb238)
![Screenshot 2024-12-15 002621](https://github.com/user-attachments/assets/f0b98f60-6d8a-44f5-ba84-8bc6644342d4)

When you have configured authentication and installed boto3, make sure you can programmatically access your AWS account by running following commands in `>python`:

```bash
import boto3
s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)
```
You shall see your previously created S3 bucket name - <yourname>-dev-terraform-bucket

# The secrets of writing quality Terraform code

The secret recipe of a successful Terraform projects consists of:

- Your understanding of your goal (desired AWS infrastructure end state)
- Your knowledge of the IaC technology used (in this case - Terraform)
- Your ability to effectively use up to date Terraform documentation [here](https://developer.hashicorp.com/terraform/language)

As you go along completing this project, you will get familiar with Terraform-specific terminology, such as:

- [Attribute](https://developer.hashicorp.com/terraform/docs/glossary#attribute)
- [Resource](https://developer.hashicorp.com/terraform/docs/glossary#resource)
- [Interpolations](https://developer.hashicorp.com/terraform/docs/glossary#interpolation)
- [Argument](https://developer.hashicorp.com/terraform/docs/glossary#argument)
- [Providers](https://developer.hashicorp.com/terraform/language/providers)
- [Provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax)
- [Input Variables](https://developer.hashicorp.com/terraform/docs/glossary#variables)
- [Output Variables](https://developer.hashicorp.com/terraform/docs/glossary#output-values)
- [Module](https://developer.hashicorp.com/terraform/docs/glossary#module)
- [Data Source](https://developer.hashicorp.com/terraform/docs/glossary#data-source)
- [Local Values](https://developer.hashicorp.com/terraform/language/v1.1.x/configuration-0-11/locals)
- [Backend](https://developer.hashicorp.com/terraform/docs/glossary#backend)

Make sure you understand them and know when to use each of them.

Another concept you must know is [data type](https://en.wikipedia.org/wiki/Data_type). This is a general programing concept, it refers to how data represented in a programming language and defines how a compiler or interpreter can use the data. Common data types are:

- Integer
- Float
- String
- Boolean, etc.

# Best practices

- Ensure that every resource is tagged using multiple key-value pairs. You will see this in action as we go along.
- Try to write reusable code, avoid hard coding values wherever possible. (For learning purpose, we will start by hard coding, but gradually refactor our work to follow best practices).


# VPC | Subnets | Security Groups

## Let us create a directory structure

Open your Visual Studio Code and:

- Create a folder called PBL
- Create a file in the folder, name it `main.tf`
![Screenshot 2024-12-15 021644](https://github.com/user-attachments/assets/97d76e59-3304-4a03-8da4-84e363a0ffbe)
![Screenshot 2024-12-15 022418](https://github.com/user-attachments/assets/251023f5-cf46-4c36-b495-8e3bdd45fd72)

# Provider and VPC resource section

Set up Terraform CLI as per [this instruction](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).

- Add AWS as a provider, and a resource to create a VPC in the main.tf file.
- Provider block informs Terraform that we intend to build infrastructure within AWS.
- Resource block will create a VPC.

```hcl
provider "aws" {
  region = "us-east-1"
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block                     = "172.16.0.0/16"
  enable_dns_support             = "true"
  enable_dns_hostnames           = "true"
  enable_classiclink             = "false"
  enable_classiclink_dns_support = "false"
}
```
__Note:__ You can change the configuration above to create your VPC in other region that is closer to you.
The same applies to all configuration snippets that will follow.

- The next thing we need to do, is to download necessary plugins for Terraform to work. These plugins are used by `providers` and `provisioners`. At this stage, we only have `provider` in our `main.tf` file. So, Terraform will just download plugin for AWS provider.
- Lets accomplish this with `terraform init` command as seen in the below demonstration.
![Screenshot 2024-12-15 022418](https://github.com/user-attachments/assets/f5fab455-f33a-432f-b27e-47b55900370d)

### Observations:

- Notice that a new directory has been created: `.terraform\....` This is where Terraform keeps plugins. Generally, it is safe to delete this folder. It just means that you must execute `terraform init` again, to download them.

Moving on, let us create the only resource we just defined. `aws_vpc`. But before we do that, we should check to see what terraform intends to create before we tell it to go ahead and create it.

- Run `terraform plan`
- Then, if you are happy with changes planned, execute `terraform apply`

terraform  validate, this will ensure that the configurations are correct and flag any errors if there are any before planning it
then terraform plan

![Screenshot 2024-12-15 092112](https://github.com/user-attachments/assets/4e7eeccb-7d6f-42f0-9d95-4971757e4e4d)

terraform apply

![Screenshot 2024-12-15 092137](https://github.com/user-attachments/assets/d81e4121-3524-4d48-8c14-d6f03e38272e)

### Observations:

1. A new file is created `terraform.tfstate` This is how Terraform keeps itself up to date with the exact state of the infrastructure. It reads this file to know what already exists, what should be added, or destroyed based on the entire terraform code that is being developed.

2. If you also observed closely, you would realise that another file gets created during planning and apply. But this file gets deleted immediately. `terraform.tfstate.lock.info` This is what Terraform uses to track, who is running its code against the infrastructure at any point in time. This is very important for teams working on the same Terraform repository at the same time. The lock prevents a user from executing Terraform configuration against the same infrastructure when another user is doing the same - it allows to avoid duplicates and conflicts.

Its content is usually like this. (We will discuss more about this later)

```hcl
{
  "ID":"e5e5ad0e-9cc5-7af1-3547-77bb3ee0958b",
  "Operation":"OperationTypePlan","Info":"",
  "Who":"dare@Dare","Version":"0.13.4",
  "Created":"2020-10-28T19:19:28.261312Z",
  "Path":"terraform.tfstate"
}
```

It is a `json` format file that stores information about a user: user's ID, what operation he/she is doing, timestamp, and location of the `state` file.


# Subnets resource section

According to our architectural design, we require 6 subnets:

- 2 public
- 2 private for webservers
- 2 private for data layer

Let us create the first 2 public subnets.

Add below configuration to the `main.tf` file:

```hcl
# Create public subnets1
  resource "aws_subnet" "public1" {
  vpc_id                     = aws_vpc.main.id
  cidr_block                 = "172.16.0.0/24"
  map_public_ip_on_launch    = true
  availability_zone          = "us-east-1a"

}

# Create public subnet2
  resource "aws_subnet" "public2" {
  vpc_id                     = aws_vpc.main.id
  cidr_block                 = "172.16.1.0/24"
  map_public_ip_on_launch    = true
  availability_zone          = "us-east-1b"
}
```
- We are creating 2 subnets, therefore declaring 2 resource blocks - one for each of the subnets.
- We are using the `vpc_id` argument to interpolate the value of the VPC id by setting it to `aws_vpc.main.id`. This way, Terraform knows inside which VPC to create the subnet.

Run `terraform plan` and `terraform apply`

![Screenshot 2024-12-15 092732](https://github.com/user-attachments/assets/8003051b-57f1-4781-a86e-140cac03d9b5)
![Screenshot 2024-12-15 092917](https://github.com/user-attachments/assets/143a63c6-f27a-485d-ad00-b2943d682481)
![Screenshot 2024-12-15 092925](https://github.com/user-attachments/assets/4bd54c2f-0950-4f0e-a3ae-4215d75dea3b)

### Observations:

- __Hard coded values:__ Remember our best practice hint from the beginning? Both the `availability_zone` and `cidr_block` arguments are hard coded. We should always endeavour to make our work dynamic.

- __Multiple Resource Blocks:__ Notice that we have declared multiple resource blocks for each subnet in the code. This is bad coding practice. We need to create a single resource block that can dynamically create resources without specifying multiple blocks. Imagine if we wanted to create 10 subnets, our code would look very clumsy. So, we need to optimize this by introducing a `count` argument.

## Now let us improve our code by refactoring it.

First, destroy the current infrastructure. Since we are still in development, this is totally fine. Otherwise, `DO NOT DESTROY` an infrastructure that has been deployed to production.

To destroy whatever has been created run `terraform destroy` command, and type yes after evaluating the plan.
![Screenshot 2024-12-15 095143](https://github.com/user-attachments/assets/e44ac4f5-f9ce-4f11-a30f-99c76c45af69)
![Screenshot 2024-12-15 095156](https://github.com/user-attachments/assets/bfd30e1c-e116-4d84-9c4d-a57344305957)

# Fixing The Problems By Code Refactoring

### __Fixing Hard Coded Values:__ We will introduce variables, and remove hard coding

- Starting with the provider block, declare a variable named region, give it a default value, and update the provider section by referring to the declared variable.

```hcl
variable "region" {
  default = "us-east-1"
}

provider "aws" {
  region = var.region
}
```
- Do the same to cidr value in the vpc block, and all the other arguments.

```hcl
variable "region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  default = "172.16.0.0/16"
}

variable "enable_dns_support" {
  default = "true"
}

variable "enable_dns_hostnames" {
  default ="true"
}

variable "enable_classiclink" {
  default = "false"
}

variable "enable_classiclink_dns_support" {
  default = "false"
}
```
```hcl
provider "aws" {
  region = var.region
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_support = var.enable_dns_support
  enable_dns_hostnames = var.enable_dns_hostname
  enable_classiclink = var.enable_classiclink
  enable_classiclink_dns_support = var.enable_classiclink
}
```

### __Fixing multiple resource blocks:__
This is where things become a little tricky. It's not complex, we are just going to introduce some interesting concepts. Loops & Data sources

Terraform has a functionality that allows us to pull data which exposes information to us. For example, every region has Availability Zones (AZ). Different regions have from 2 to 4 Availability Zones. With over 20 geographic regions and over 70 AZs served by AWS, it is impossible to keep up with the latest information by hard coding the names of AZs. Hence, we will explore the use of Terraform's `Data Sources` to fetch information outside of Terraform. In this case, from `AWS`

Let us fetch Availability zones from AWS, and replace the hard coded value in the subnet's `availability_zone` section.

```hcl
# Get list of availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
```
To make use of this new data resource, we will need to introduce a `count` argument in the subnet block: Something like this.

```hcl
# Create public subnet1
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "172.16.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
}
```
Let us quickly understand what is going on here.

- The `count` tells us that we need 2 subnets. Therefore, Terraform will invoke a loop to create 2 subnets.
- The `data` resource will return a list object that contains a list of AZs. Internally, Terraform will receive the data like this

```hcl
["us-east-1a", "us-east-1b"]
```
Each of them is an index, the first one is index 0, while the other is index 1. If the data returned had more than 2 records, then the index numbers would continue to increment.

Therefore, each time Terraform goes into a loop to create a subnet, it must be created in the retrieved AZ from the list. Each loop will need the index number to determine what AZ the subnet will be created.
That is why we have `data.aws_availability_zones.available.names[count.index]` as the value for `availability_zone`. When the first loop runs, the first index will be 0, therefore the AZ will be `eu-central-1a`. The pattern will repeat for the second loop.

But we still have a problem. If we run Terraform with this configuration, it may succeed for the first time, but by the time it goes into the second loop, it will fail because we still have `cidr_block` hard coded. The same `cidr_block` cannot be created twice within the same VPC. So, we have a little more work to do.

## Let's make `cidr_block` dynamic.

We will introduce a function `cidrsubnet()` to make this happen. It accepts 3 parameters. Let us use it first by updating the configuration, then we will explore its internals.

```hcl
# Create public subnet1
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4 , count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
}
```
A closer look at `cidrsubnet` - this function works like an algorithm to dynamically create a subnet CIDR per AZ. Regardless of the number of subnets created, it takes care of the cidr value per subnet.

Its parameters are `cidrsubnet(prefix, newbits, netnum)`

- The `prefix` parameter must be given in CIDR notation, same as for VPC.

- The `newbits` parameter is the number of additional bits with which to extend the prefix.
For `example`, if given a prefix ending with /16 and a newbits value of 4, the resulting subnet address will have length /20

- The `netnum` parameter is a whole number that can be represented as a binary integer with no more than `newbits` binary digits, which will be used to populate the additional bits added to the prefix

You can experiment how this works by entering the `terraform console` and keep changing the figures to see the output.

- On the terminal, run `terraform console`
- type `cidrsubnet("172.16.0.0/16", 4, 0)`
- Hit enter
- See the output
- Keep change the numbers and see what happens.
- To get out of the console, type `exit`
![Screenshot 2024-12-15 104226](https://github.com/user-attachments/assets/cfd43d6d-940e-4b0b-9f25-a69359846388)
![Screenshot 2024-12-15 104353](https://github.com/user-attachments/assets/14023676-0865-4ebc-9b38-2c9df3d84ac3)
# The final problem to solve is removing hard coded count value.

If we cannot hard code a value we want, then we will need a way to dynamically provide the value based on some input. Since the `data` resource returns all the AZs within a region, it makes sense to count the number of AZs returned and pass that number to the `count` argument.

To do this, we can introuduce `length()` function, which basically determines the length of a given list, map, or string.

Since `data.aws_availability_zones.available.names` returns a list like `["eu-central-1a", "eu-central-1b", "eu-central-1c"]` we can pass it into a `lenght` function and get number of the AZs.

```hcl
length(["us-east-1a", "us-east-1b", "us-east-1c"])
```
Open up `terraform console` and try it

Now we can simply update the public subnet block like this

```hcl
# Create public subnet1
resource "aws_subnet" "public" {
  count                   = length(data.aws_availability_zones.available.names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4 , count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]

}
```
### Observations:

What we have now, is sufficient to create the subnet resource required. But if you observe, it is not satisfying our business requirement of just 2 subnets. The `length` function will return number 3 to the `count` argument, but what we actually need is 2.

Now, let us fix this.

- Declare a variable to store the desired number of public subnets, and set the default value

```hcl
variable "preferred_number_of_public_subnets" {
  default = 2
}
```
Next, update the `count` argument with a condition. Terraform needs to check first if there is a desired number of subnets. Otherwise, use the data returned by the `lenght` function. See how that is presented below.

```hcl
# Create public subnets
resource "aws_subnet" "public" {
  count  = var.preferred_number_of_public_subnets == null ? length(data.aws_availability_zones.available.names) : var.preferred_number_of_public_subnets
  vpc_id = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4 , count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
}
```
Now lets break it down:

- The first part `var.preferred_number_of_public_subnets == null` checks if the value of the variable is set to `null` or has some value defined.

- The second part `?` and `length(data.aws_availability_zones.available.names)` means, if the first part is true, then use this. In other words, if preferred number of public subnets is `null` (Or not known) then set the value to the data returned by `lenght` function.

- The third part `:` and `var.preferred_number_of_public_subnets` means, if the first condition is false, i.e preferred number of public subnets is `not null` then set the value to whatever is definied in `var.preferred_number_of_public_subnets`

Now the entire configuration should now look like this

```hcl
# Get list of availability zones
data "aws_availability_zones" "available" {
state = "available"
}

variable "region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  default = "172.16.0.0/16"
}

variable "enable_dns_support" {
  default = "true"
}

variable "enable_dns_hostnames" {
  default ="true"
}

variable "enable_classiclink" {
  default = "false"
}

variable "enable_classiclink_dns_support" {
  default = "false"
}

variable "preferred_number_of_public_subnets" {
  default = 2
}

provider "aws" {
  region = var.region
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block                     = var.vpc_cidr
  enable_dns_support             = var.enable_dns_support
  enable_dns_hostnames           = var.enable_dns_support
  enable_classiclink             = var.enable_classiclink
  enable_classiclink_dns_support = var.enable_classiclink

}

# Create public subnets
resource "aws_subnet" "public" {
  count  = var.preferred_number_of_public_subnets == null ? length(data.aws_availability_zones.available.names) : var.preferred_number_of_public_subnets
  vpc_id = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4 , count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]

}
```
Now run `terraform plan` to see the how many subnets that will be created

![Screenshot 2024-12-15 113731](https://github.com/user-attachments/assets/ce27c8c5-cc7d-4557-89fe-5c971daf86c3)
![Screenshot 2024-12-15 113201](https://github.com/user-attachments/assets/5d04e9fc-b2ca-4164-8761-c3dadb9e794b)

# Introducing variables.tf & terraform.tfvars

Instead of havng a long lisf of variables in `main.tf` file, we can actually make our code a lot more readable and better structured by moving out some parts of the configuration content to other files.

- We will put all variable declarations in a separate file
- And provide non default values to each of them

1. Create a new file and name it `variables.tf`
2. Copy all the variable declarations into the new file.
3. Create another file, name it `terraform.tfvars`
4. Set values for each of the variables.

## Maint.tf

```hcl
# Get list of availability zones
data "aws_availability_zones" "available" {
state = "available"
}

provider "aws" {
  region = var.region
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block                     = var.vpc_cidr
  enable_dns_support             = var.enable_dns_support
  enable_dns_hostnames           = var.enable_dns_support
  enable_classiclink             = var.enable_classiclink
  enable_classiclink_dns_support = var.enable_classiclink

}

# Create public subnets
resource "aws_subnet" "public" {
  count  = var.preferred_number_of_public_subnets == null ? length(data.aws_availability_zones.available.names) : var.preferred_number_of_public_subnets
  vpc_id = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4 , count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
}
```
![Screenshot 2024-12-15 123738](https://github.com/user-attachments/assets/46d2b87b-f954-4580-885c-860681d8e4ca)

## variables.tf

```hcl
variable "region" {
      default = "eu-central-1"
}

variable "vpc_cidr" {
    default = "172.16.0.0/16"
}

variable "enable_dns_support" {
    default = "true"
}

variable "enable_dns_hostnames" {
    default ="true"
}

variable "enable_classiclink" {
    default = "false"
}

variable "enable_classiclink_dns_support" {
    default = "false"
}

  variable "preferred_number_of_public_subnets" {
      default = null
}
```
![Screenshot 2024-12-15 123754](https://github.com/user-attachments/assets/2dd69216-eb7f-4767-8143-350990c56494)


## terraform.tfvars

```hcl
region = "eu-central-1"

vpc_cidr = "172.16.0.0/16"

enable_dns_support = "true"

enable_dns_hostnames = "true"

enable_classiclink = "false"

enable_classiclink_dns_support = "false"

preferred_number_of_public_subnets = 2

![Screenshot 2024-12-15 123746](https://github.com/user-attachments/assets/d9978b2b-fc8b-4bfc-a5a8-29817661bb68)

We should also have this file structure in the `PBL` folder.

```css
└── PBL
    ├── main.tf
    ├── terraform.tfstate
    ├── terraform.tfstate.backup
    ├── terraform.tfvars
    └── variables.tf
```
![Screenshot 2024-12-15 123724](https://github.com/user-attachments/assets/c0ba67a7-3c5f-462a-b4be-6162e7b608d9)

Run `terraform plan` and ensure everything works
![Screenshot 2024-12-15 124035](https://github.com/user-attachments/assets/10e5f02d-b948-4732-b992-8349f43dd14c)

__Notice__: The Plan: 3 to add, 0 to change, 0 to destroy.

Implies that 3 resources will be created: A VPC and 2 subnets (with index 0 and 1) despite setting `preferred_number_of_public_subnets` to `null` in `variables.tf`.
This is because any value specified in the `terraform.tfvars` overrides the default value.

Run `terraform apply` to create the resources
![Screenshot 2024-12-15 124035](https://github.com/user-attachments/assets/0bc8fb4b-751a-4d99-855f-6b101053ede4)
![Screenshot 2024-12-15 124307](https://github.com/user-attachments/assets/da98c989-6cda-47d6-97d3-05c47a05abd3)
![Screenshot 2024-12-15 124410](https://github.com/user-attachments/assets/c307c36a-198d-41d4-8bfd-b2d914de4141)


Run `terraform destroy` to delete all resources created

![Screenshot 2024-12-15 125336](https://github.com/user-attachments/assets/46ade098-3c20-42df-993e-1292e09f8532)
![Screenshot 2024-12-15 125344](https://github.com/user-attachments/assets/6207aba9-6f9d-470a-bfa1-83e04bc6e484)


With this implementation, we have learned how to create and delete AWS Network Infrastructure programmatically with Terraform.
