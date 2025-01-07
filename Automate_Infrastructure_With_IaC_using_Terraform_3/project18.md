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
