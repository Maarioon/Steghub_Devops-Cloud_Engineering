# Automating Infrastructure with Terraform: Advanced Refactoring

In earlier projects, we created AWS infrastructure using Terraform and ran it locally on our workstations. Now, it's time to take things to the next level by introducing advanced concepts to make our infrastructure more robust and team-friendly.

---

## **Using Terraform Backends for Better State Management**

Terraform configurations can use backends to define how and where operations are performed and where state snapshots are stored. Until now, we've used the default **local backend**, which keeps the state file on your local machine. While this is great for learning, it's not ideal for real-world projects. 

### **Why Move Away from Local Backends?**
1. **Durability and Reliability:** Local state files are prone to loss or corruption. Using remote storage ensures better reliability.
2. **Team Collaboration:** In a multi-developer team, others won’t have access to the state file stored on your computer, making collaboration difficult.

To address these issues, we’ll configure Terraform to use a remote backend. Since we’re already using AWS, we’ll store the state file in an **S3 bucket**.

---

## **Introducing S3 as a Terraform Backend**

By configuring Terraform to use an **S3 bucket as a backend**, we can securely and reliably store state files. S3 also supports **versioning**, allowing us to track changes to the state over time. Additionally, we’ll enable **state locking** to prevent multiple users from making conflicting changes simultaneously. State locking requires **DynamoDB**, another AWS service.

---

## **Steps to Configure the S3 Backend**

Here’s the plan to refactor Terraform for S3 backend usage:

1. **Set Up S3 and DynamoDB Resources:**
   Create an S3 bucket for state storage and a DynamoDB table for state locking.
2. **Update the Terraform Configuration:**
   Modify the Terraform `backend` block to point to the new S3 bucket and enable locking.
3. **Reinitialize Terraform:**
   Use the `terraform init` command to apply the backend changes.
4. **Verify Backend Configuration:**
   Check that the state file is moved from local storage to the S3 bucket.
5. **Secure State Files:**
   Enable encryption to protect sensitive data stored in the state file.
6. **Apply Changes:**
   Test the configuration by applying infrastructure changes.

---

## **Example Configuration**

Create a file named `backend.tf` and add the following code. Replace `francis-dev-terraform-bucket` with your unique bucket name.

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "busola-dev-terraform-bucket"
  force_destroy = true
}

# Enable versioning to maintain a history of state changes
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption to secure state files
resource "aws_s3_bucket_server_side_encryption_configuration" "state_encryption" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```
Terraform expects that both S3 bucket and DynamoDB resources are already created before we configure the backend. So, let us run `terraform apply` to provision resources.

### 3. Configure S3 Backend

```hcl
terraform {
  backend "s3" {
    bucket         = "francis-dev-terraform-bucket"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```
Now its time to re-initialize the backend. Run `terraform init` and confirm you are happy to change the backend by typing `yes`

![Screenshot 2024-12-29 114055](https://github.com/user-attachments/assets/61b4ffe7-d3c8-485b-84b8-f61be0d34828)
![Screenshot 2024-12-29 114520](https://github.com/user-attachments/assets/4009bf91-7aee-477d-94ac-5f5b6dc05db1)
![Screenshot 2024-12-29 115502](https://github.com/user-attachments/assets/b128d48e-2ec2-4794-bda4-a2f0105f0c38)
![Screenshot 2024-12-29 115622](https://github.com/user-attachments/assets/7fb90338-b663-40ad-b6a1-4af2ae5ffe9a)
![Screenshot 2024-12-29 115643](https://github.com/user-attachments/assets/4cb780c6-0ee2-4e80-a251-8c7e629d1087)
![Screenshot 2024-12-29 060046](https://github.com/user-attachments/assets/a412253c-b98f-4e61-8859-d4d92815bff3)

### 4. Verify the changes

Before doing anything if you opened AWS now to see what happened you should be able to see the following:

- `.tfstatefile` is now inside the S3 bucket
  ![Screenshot 2024-12-29 115708](https://github.com/user-attachments/assets/3e0c368c-0fff-4301-ab4a-cf8be36c5c2e)

- DynamoDB table which we create has an entry which includes state file status
![Screenshot 2024-12-29 123506](https://github.com/user-attachments/assets/5debfc24-660d-4c26-8a5c-688dcaa8c0de)
![Screenshot 2024-12-30 134247](https://github.com/user-attachments/assets/0ed3a4a8-9d11-425e-b113-8e1f0f22aa91)

- Navigate to the DynamoDB table inside AWS and leave the page open in your browser. Run `terraform plan` and while that is running, refresh the browser and see how the lock is being handled:
![Screenshot 2025-01-07 014139](https://github.com/user-attachments/assets/a08aa3c7-08be-4682-87f9-8c06d9228808)

### 5. Add Terraform Output

Before we run `terraform apply` let us add an output so that the S3 bucket Amazon Resource Names ARN and DynamoDB table name can be displayed.

Create a new file and name it output.tf and add below code.

```hcl
output "s3_bucket_arn" {
  value       = aws_s3_bucket.terraform_state.arn
  description = "The ARN of the S3 bucket"
}
output "dynamodb_table_name" {
  value       = aws_dynamodb_table.terraform_locks.name
  description = "The name of the DynamoDB table"
}
```

Now we have everything ready to go!

### 6. Let us run `terraform apply`

Terraform will automatically read the latest state from the S3 bucket to determine the current state of the infrastructure. Even if another engineer has applied changes, the state file will always be up to date.

Now, let's head over to the S3 console again, refresh the page, and click the grey “Show” button next to “Versions.” We should now see several versions of our terraform.tfstate file in the S3 bucket:

With help of remote backend and locking configuration that we have just configured, collaboration is no longer a problem.

With help of remote backend and locking configuration that we have just configured, collaboration is no longer a problem.

However, there is still one more problem: Isolation Of Environments. Most likely we will need to create resources for different environments, such as: `Dev`, `sit`, `uat`, `preprod`, `prod`, etc.

This separation of environments can be achieved using one of two methods:

a. Terraform Workspaces
b. Directory based separation using `terraform.tfvars` file
![Screenshot 2024-12-30 140433](https://github.com/user-attachments/assets/7758ea98-5331-4fdf-b017-41605abd1af5)

### When to use `Workspaces` or `Directory`?

To separate environments with significant configuration differences, use a directory structure. Use workspaces for environments that do not greatly deviate from each other, to avoid duplication of your configurations. Try both methods in the sections below to help you understand which will serve your infrastructure best.

For now, we can read more about both alternatives here and try both methods ourself, but we will explore them better in next projects.

## Security Groups refactoring with __`dynamic block`__

For repetitive blocks of code you can use dynamic blocks in Terraform, to get to know more how to use them - watch this video.

### Refactor Security Groups creation with `dynamic blocks
![Screenshot 2024-12-30 134535](https://github.com/user-attachments/assets/a791aff3-f88a-4569-9ef2-8a6439369428)

The terraform code above is available in this [repository](https://github.com/francdomain/project_18_terraform_code)

## EC2 refactoring with `Map` and `Lookup`

Remember, every piece of work you do, always try to make it dynamic to accommodate future changes. [Amazon Machine Image (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) is a regional service which means it is only available in the region it was created. But what if we change the region later, and want to dynamically pick up `AMI IDs` based on the available AMIs in that region? This is where we will introduce [Map](https://developer.hashicorp.com/terraform/language/functions/map) and [Lookup](https://developer.hashicorp.com/terraform/language/functions/lookup) functions.

Map uses a key and value pairs as a data structure that can be set as a default type for variables.

```hcl
variable "images" {
    type = "map"
    default = {
        us-east-1 = "image-1234"
        us-west-2 = "image-23834"
    }
}
```

To select an appropriate AMI per region, we will use a lookup function which has following syntax: __`lookup(map, key, [default])`__.

__Note:__ A default value is better to be used to avoid failure whenever the map data has no key.

```hcl
resource "aws_instace" "web" {
    ami  = "${lookup(var.images, var.region), "ami-12323"}
}
```
Now, the lookup function will load the variable `images` using the first parameter. But it also needs to know which of the key-value pairs to use. That is where the second parameter comes in. The key `us-east-1` could be specified, but then we will not be doing anything dynamic there, but if we specify the variable for region, it simply resolves to one of the keys. That is why we have used `var.region` in the second parameter.

# Conditional Expressions

If you want to make some decision and choose some resource based on a condition - you shall use Terraform Conditional Expressions.

In general, the syntax is as following: condition `? true_val : false_val`

Read following snippet of code and try to understand what it means:

```hcl
resource "aws_db_instance" "read_replica" {
  count               = var.create_read_replica == true ? 1 : 0
  replicate_source_db = aws_db_instance.this.id
}
```
- true #condition equals to 'if true'
- ? #means, set to '1`
- : #means, otherwise, set to '0'


# Terraform Modules and best practices to structure your `.tf` codes

By this time, you might have realized how difficult is to navigate through all the Terraform blocks if they are all written in a single long `.tf` file. As a DevOps engineer, you must produce reusable and comprehensive IaC code structure, and one of the tool that Terraform provides out of the box is [Modules](https://developer.hashicorp.com/terraform/language/modules).

Modules serve as containers that allow to logically group Terraform codes for similar resources in the same domain (e.g., Compute, Networking, AMI, etc.). One `root module` can call other `child modules` and insert their configurations when applying Terraform config. This concept makes your code structure neater, and it allows different team members to work on different parts of configuration at the same time.

You can also create and publish your modules to [Terraform Registry](https://registry.terraform.io/browse/modules) for others to use and use someone's modules in your projects.

Module is just a collection of `.tf` and/or `.tf.json` files in a directory.

You can refer to existing child modules from your `root module` by specifying them as a source, like this:

```hcl
module "network" {
  source = "./modules/network"
}
```
Note that the path to 'network' module is set as relative to your working directory.

Or you can also directly access resource outputs from the modules, like this:

```hcl
resource "aws_elb" "example" {
  # ...

  instances = module.servers.instance_ids
}
```
In the example above, you will have to have module 'servers' to have output file to expose variables for this resource.

## Refactor your project using Modules

Let us review the [repository](https://github.com/francdomain/Automate_Infrastructure_With_IaC_using_Terraform_2)of project 17, you will notice that we had a single lsit of long file for creating all of our resources, but that is not the best way to go about it because it maks our code base vey hard to read and understand, and making future changes can bring a lot of pain.

## QUICK TASK:

Break down your Terraform codes to have all resources in their respective modules. Combine resources of a similar type into directories within a 'modules' directory, for example, like this:

```css
- modules
  - ALB
  - EFS
  - RDS
  - Autoscaling
  - compute
  - VPC
  - security
```

![Screenshot 2024-12-31 073730](https://github.com/user-attachments/assets/cb148db3-6b5b-4b7a-b212-0b8b11a3bb21)

Each module shall contain following files:

```css
- main.tf (or %resource_name%.tf) file(s) with resources blocks
- outputs.tf (optional, if you need to refer outputs from any of these resources in your root module)
- variables.tf (as we learned before - it is a good practice not to hard code the values and use variables)
```
It is also recommended to configure `providers` and `backends` sections in separate files.

__NOTE:__ It is not compulsory to use this naming convention.

After you have given it a try, you can check out this [repository](https://github.com/dareyio/PBL-project-18)

It is not compulsory to use this naming convention for guidiance or to fix your errors.

In the configuration sample from the repository, you can observe two examples of referencing the module:

a. Import module as a `source` and have access to its variables via `var` keyword:

```hcl
module "VPC" {
  source = "./modules/VPC"
  region = var.region
  ...
```

b. Refer to a module's output by specifying the full path to the output variable by using __`module.%module_name%.%output_name%`__ construction:

```hcl
subnets-compute = module.network.public_subnets-1
```

## Complete the Terraform configuration

Complete the rest of the codes yourself, so, the resulted configuration structure in your working directory may look like this:

```css
└── PBL
    ├── modules
    |   ├── ALB
    |     ├── ... (module .tf files, e.g., main.tf, outputs.tf, variables.tf)
    |   ├── EFS
    |     ├── ... (module .tf files)
    |   ├── RDS
    |     ├── ... (module .tf files)
    |   ├── autoscaling
    |     ├── ... (module .tf files)
    |   ├── compute
    |     ├── ... (module .tf files)
    |   ├── network
    |     ├── ... (module .tf files)
    |   ├── security
    |     ├── ... (module .tf files)
    ├── main.tf
    ├── backends.tf
    ├── providers.tf
    ├── data.tf
    ├── outputs.tf
    ├── terraform.tfvars
    └── variables.tf
```
![Screenshot 2025-01-07 074620](https://github.com/user-attachments/assets/788a6855-5adf-4bdd-bf8d-dab254135d86)
### Instantiating the Modules
![Screenshot 2024-12-30 180154](https://github.com/user-attachments/assets/615fab6c-2c74-469a-9606-fd452b5ef063)
![Screenshot 2024-12-30 180251](https://github.com/user-attachments/assets/f6df37d6-3bf8-42d6-b7c3-a7b4fce617e0)
![Screenshot 2024-12-30 180359](https://github.com/user-attachments/assets/3f8852db-3307-47f3-9813-2cf63efe47ae)
![Screenshot 2024-12-30 182140](https://github.com/user-attachments/assets/773eab07-d34f-448a-830e-1557f08c6934)
![Screenshot 2024-12-31 073648](https://github.com/user-attachments/assets/9cf60266-f6f7-4722-b225-1c382b1a58cf)
![Screenshot 2024-12-31 073656](https://github.com/user-attachments/assets/134b8968-4e14-4dd8-9fe0-a0e0cbba17a9)
![Screenshot 2024-12-31 073949](https://github.com/user-attachments/assets/19f4d668-b919-4742-942b-ffe19176588c)
![Screenshot 2024-12-31 074012](https://github.com/user-attachments/assets/822024ee-e670-47da-953b-ab56b38f202f)
![Screenshot 2024-12-31 074030](https://github.com/user-attachments/assets/02d87004-a0e9-4285-b159-eb970249b1bf)
![Screenshot 2024-12-31 082604](https://github.com/user-attachments/assets/be95e0e7-e6af-4025-a9b0-cb958154c563)
![Screenshot 2024-12-31 082708](https://github.com/user-attachments/assets/8822dbd7-46ab-41b6-a46c-e882e1089474)
![Screenshot 2025-01-01 014315](https://github.com/user-attachments/assets/4f8e302b-42e3-4780-b603-67c49ee1fe79)
![Screenshot 2025-01-06 011555](https://github.com/user-attachments/assets/9f9fa4f6-188b-456b-99cc-0116b922f616)
![Screenshot 2025-01-06 013108](https://github.com/user-attachments/assets/34c03a80-31ae-41d6-8996-abfacc958e9d)
![Screenshot 2025-01-07 012931](https://github.com/user-attachments/assets/ee065293-5fad-4c59-a2e0-7244d20a4bff)
![Screenshot 2025-01-07 014139](https://github.com/user-attachments/assets/cf69f8aa-a21b-4b3a-9bdc-f38bfc3fd0df)
![Screenshot 2025-01-07 014416](https://github.com/user-attachments/assets/aafadf96-af2a-4405-957a-9e8df395598f)
![Screenshot 2025-01-07 014457](https://github.com/user-attachments/assets/0c21f0d0-d903-424b-a76b-d4486d02f6fd)
![Screenshot 2025-01-07 014514](https://github.com/user-attachments/assets/90ced520-6893-4c08-b4f9-dc8298088886)
![Screenshot 2025-01-07 014529](https://github.com/user-attachments/assets/e13a110f-5879-481c-9dd7-8a3ded79f7f1)
![Screenshot 2025-01-07 014542](https://github.com/user-attachments/assets/0ddcf0e1-ecec-425d-a910-143c4e3ba4de)
![Screenshot 2025-01-07 014558](https://github.com/user-attachments/assets/1fa03586-d5b1-4117-863f-d14c616d6d1f)
![Screenshot 2025-01-07 014707](https://github.com/user-attachments/assets/59d08621-22da-457a-b6b5-f8c0440ffef6)
![Screenshot 2025-01-07 014720](https://github.com/user-attachments/assets/926e80c6-b922-40ac-9f89-fdbbdaae4fc8)
![Screenshot 2025-01-07 014829](https://github.com/user-attachments/assets/9025d66f-cae9-4250-9af6-108f12c0f2ac)
![Screenshot 2025-01-07 014909](https://github.com/user-attachments/assets/15733588-1231-4763-9304-4f6d71a9c438)
![Screenshot 2025-01-07 015331](https://github.com/user-attachments/assets/606e849a-1d3c-41e8-8cb3-21825c433269)
![Screenshot 2025-01-07 015552](https://github.com/user-attachments/assets/ac923efb-561a-4498-bf11-083d3daa20c9)
![Screenshot 2025-01-07 015623](https://github.com/user-attachments/assets/c15ef525-7352-4d3c-bdbe-be126f00edad)
![Screenshot 2025-01-07 015656](https://github.com/user-attachments/assets/e7241bfe-ec8c-45f3-a2c1-a71151d517c5)
![Screenshot 2025-01-07 015901](https://github.com/user-attachments/assets/ccf153a5-36f4-4f9e-b8e2-e46daabef2c2)
![Screenshot 2025-01-07 020043](https://github.com/user-attachments/assets/134dc6ed-84d3-4568-8667-ded7dd30fd2e)
![Screenshot 2025-01-07 020119](https://github.com/user-attachments/assets/59fa5949-99f6-4390-b2ba-b6f574f635e4)
![Screenshot 2025-01-07 020129](https://github.com/user-attachments/assets/da34123c-d67a-499d-addd-68699f7425fd)
![Screenshot 2025-01-07 023252](https://github.com/user-attachments/assets/21cddefa-4315-4dff-b316-1afcf44aa2de)
![Screenshot 2025-01-07 031810](https://github.com/user-attachments/assets/9e59d885-d1c3-4df2-b258-c562eff5b8e5)
