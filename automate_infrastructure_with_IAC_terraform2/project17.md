![Screenshot 2024-12-22 123444](https://github.com/user-attachments/assets/ae3fd9e9-413d-4cd1-aeb7-d1a835cc2c05)# AUTOMATE-INFRASTRUCTURE-WITH-IAC-USING-TERRAFORM-PART-2
This is a continuation from the previous project 16. Here , we will need to set up subnets just like what we did in earlier manually.

## Networking - Private subnets & best practices
- Create 4 private subnets keeping in mind following principles:
  - Make sure you use variables or length() function to determine the number of AZs.
  - Use variables and cidrsubnet() function to allocate vpc_cidr for subnets.
  - Keep variables and resources in separate files for better code structure and readability.
  - Tag all the resources you have created so far. Explore how to use format() and count functions to automatically tag subnets with its respective number.
    
  **Note**: You can add multiple tags as a default set. for example, in out terraform.tfvars file we can have default tags defined.

        tags = {
          Environment      = "production" 
          Owner-Email     = "infradev-segun@darey.io"
          Managed-By      = "Terraform"
          Billing-Account = "1234567890"
        }

- Now you can tag all your resources using the format below

        tags = merge(
            var.tags,
            {
              Name = "Name of the resource"
            },
          )

The great thing about this is; anytime we need to make a change to the tags, we simply do that in one single place.

But, our key-value pairs are hard coded. So, go ahead and work out a fix for that. Simply create variables for each value and use var.variable_name as the value to each of the keys. 
Apply the same best practices for all other resources you are going to create.

- ![variableterraform](https://github.com/user-attachments/assets/0bf97a28-aa19-4a1e-9165-1661b8768720)
- ![mainterraform](https://github.com/user-attachments/assets/0128d06e-4044-41b9-9b54-5bba10c99267)



## Internet Gateways & format() function

Create an Internet Gateway in a separate Terraform file internet_gateway.tf

      resource "aws_internet_gateway" "ig" {
        vpc_id = aws_vpc.main.id
      
        tags = merge(
          var.tags,
          {
            Name = format("%s-%s!", aws_vpc.main.id,"IG")
          } 
        )
      }

Did you notice how we have used format() function to dynamically generate a unique name for this resource? The first part of the %s takes the interpolated value of aws_vpc.main.id while the second %s appends a literal string IG and finally an exclamation mark is added in the end.

If any of the resources being created is either using the count function or creating multiple resources using a loop, then a key-value pair that needs to be unique must be handled differently.

For example, each of our subnets should have a unique name in the tag section. Without the format() function, this would not be possible. With the format function, each private subnet's tag will look like this.


        Name = PrvateSubnet-0
        Name = PrvateSubnet-1
        Name = PrvateSubnet-2
Lets try and see that in action.

        tags = merge(
          var.tags,
          {
            Name = format("PrivateSubnet-%s", count.index)
          } 
        )
![Screenshot 2024-12-22 123740](https://github.com/user-attachments/assets/e68df541-6b0f-4036-94ee-d46bcfa87100)
![Screenshot 2024-12-22 130709](https://github.com/user-attachments/assets/945009b9-a991-4b69-a8da-31608ea184b7)

## NAT Gateways

### Create 1 `NAT Gateways` and 1 `Elastic IP` (EIP) addresses

Now use similar approach to create the NAT Gateways in a new file called __`natgateway.tf`__.

Note: We need to create an Elastic IP for the NAT Gateway, and you can see the use of `depends_on` to indicate that the Internet Gateway resource must be available before this should be created. Although Terraform does a good job to manage dependencies, in most cases, it is good to be explicit.

You can read more on dependencies [here](https://developer.hashicorp.com/terraform/language/meta-arguments/depends_on)

```hcl
resource "aws_eip" "nat_eip" {
  vpc        = true
  depends_on = [aws_internet_gateway.ig]

  tags = merge(
    var.tags,
    {
      Name = format("%s-EIP", var.name)
    },
  )
}


resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = element(aws_subnet.public.*.id, 0)
  depends_on    = [aws_internet_gateway.ig]

  tags = merge(
    var.tags,
    {
      Name = format("%s-Nat", var.name)
    },
  )
}
```

![Screenshot 2024-12-22 123753](https://github.com/user-attachments/assets/dd9d9552-2b44-4c6d-a41b-9e1b55c0c496)
![Screenshot 2024-12-22 130719](https://github.com/user-attachments/assets/25b9997d-d4ed-4d58-af89-84ffd0c18e8f)
## AWS routes

### Create a file called `route_tables.tf` and use it to create routes for both public and private subnets.

Create the resources below and ensure they are properly tagged.

- aws_route_table
- aws_route
- aws_route_table_association

```hcl
# create private route table
resource "aws_route_table" "private-rtb" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = format("%s-Private-Route-Table", var.name)
    },
  )
}

# associate all private subnets to the private route table
resource "aws_route_table_association" "private-subnets-assoc" {
  count          = length(aws_subnet.private[*].id)
  subnet_id      = element(aws_subnet.private[*].id, count.index)
  route_table_id = aws_route_table.private-rtb.id
}

# create route table for the public subnets
resource "aws_route_table" "public-rtb" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = format("%s-Public-Route-Table", var.name)
    },
  )
}

# create route for the public route table and attach the internet gateway
resource "aws_route" "public-rtb-route" {
  route_table_id         = aws_route_table.public-rtb.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.ig.id
}

# associate all public subnets to the public route table
resource "aws_route_table_association" "public-subnets-assoc" {
  count          = length(aws_subnet.public[*].id)
  subnet_id      = element(aws_subnet.public[*].id, count.index)
  route_table_id = aws_route_table.public-rtb.id
}
```
![Screenshot 2024-12-22 123825](https://github.com/user-attachments/assets/6c9e9d63-8484-4b3c-9ea2-079ec13ae7c6)

![Screenshot 2024-12-22 130648](https://github.com/user-attachments/assets/91a064e4-e43a-45c8-a390-094f959edbad)
Now if you run __`terraform plan`__ and __`terraform apply`__, it will add the following resources to AWS in `multi-az` set up:

- [x] - Our main vpc
- [x] - 2 Public subnets
- [x] - 4 Private subnets
- [x] - 1 Internet Gateway
- [x] - 1 NAT Gateway
- [x] - 1 EIP
- [x] - 2 Route tables
![Screenshot 2024-12-22 123405](https://github.com/user-attachments/assets/38e069c0-c692-4c8c-a99f-e944e6874edf)
# AWS Identity and Access Management

## IaM and Roles

We want to pass an IAM role on EC2 instances to give them access to some specific resources, so we need to do the following:

### 1. Create [`AssumeRole`](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)

Assume Role uses Security Token Service (STS) API that returns a set of temporary security credentials that we can use to access AWS resources that we may not normally have access to. These temporary credentials consist of an access key ID, a secret access key, and a security token. Typically, we use `AssumeRole` within our account or for cross-account access.

Add the following code to a new file named __`roles.tf`__

```hcl
resource "aws_iam_role" "ec2_instance_role" {
name = "ec2_instance_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  tags = merge(
    var.tags,
    {
      Name = "aws assume role"
    },
  )
}
```

In this code, we are creating `AssumeRole` with `AssumeRole policy`. It grants to an entity, in our case it is an EC2, permissions to assume the role.

### 2. Create [`IAM policy`](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) for this role

```hcl
resource "aws_iam_policy" "policy" {
  name        = "ec2_instance_policy"
  description = "A test policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:Describe*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]

  })

  tags = merge(
    var.tags,
    {
      Name =  "aws assume policy"
    },
  )

}
```

### 3. Attach the `Policy` to the `IAM Role`

This is where, we will be attaching the policy which we created above, to the role we created in the first step.

```hcl
resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = aws_iam_role.ec2_instance_role.name
  policy_arn = aws_iam_policy.policy.arn
}
```

### 4. Create an [Instance Profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) and interpolate the `IAM Role`

```hcl
resource "aws_iam_instance_profile" "ip" {
  name = "aws_instance_profile_test"
  role = aws_iam_role.ec2_instance_role.name
}
```
![Screenshot 2024-12-20 133555](https://github.com/user-attachments/assets/4de57148-7fad-4c34-af3d-124d8660a213)
![Screenshot 2024-12-20 133625](https://github.com/user-attachments/assets/a42a8721-06f9-4e7e-ac60-464b42c01c7f)
![Screenshot 2024-12-20 133911](https://github.com/user-attachments/assets/62e470db-63a1-491a-83ce-1effdd78d597)
![Screenshot 2024-12-20 141348](https://github.com/user-attachments/assets/05014f16-1cc0-42c1-a480-fd0138412590)


We are pretty much done with the Identity and Management part for now, let us move on and create other resources required.


# Resources to be created

Going by our architecture, we need to do the following:

1. Create Security Groups.

2. Create Target Group for `Nginx`, `WordPress` and `Tooling`.

3. Create certificate from AWS certificate manager (`ACM`).

4. Create an `External Application Load Balancer` and `Internal Application Load Balancer`.

5. Create launch template for `Bastion`, `Tooling`, `Nginx` and `WordPress`.

6. Create an Auto Scaling Group (`ASG`) for Bastion, Tooling, Nginx and WordPress.

7. Create Elastic Filesystem.

8. Create Relational Database (`RDS`)

Let us create some Terraform configuration code to accomplish these tasks.

## 1. Create Security Groups

We are going to create all the security groups in a single file, then we are going to refrence this security group within each resources that needs it.

- Check out the terraform documentation for [security group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group)
- Check out the terraform documentation for [security group rule](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule)

### Create a file and name it `security.tf`, copy and paste the code below:

```hcl
# security group for alb, to allow acess from any where for HTTP and HTTPS traffic
resource "aws_security_group" "ext-alb-sg" {
  name        = "ext-alb-sg"
  vpc_id      = aws_vpc.main.id
  description = "Allow TLS inbound traffic"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

 tags = merge(
    var.tags,
    {
      Name = "ext-alb-sg"
    },
  )

}


# security group for bastion, to allow access into the bastion host from you IP
resource "aws_security_group" "bastion_sg" {
  name        = "vpc_web_sg"
  vpc_id = aws_vpc.main.id
  description = "Allow incoming HTTP connections."

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

   tags = merge(
    var.tags,
    {
      Name = "Bastion-SG"
    },
  )
}



#security group for nginx reverse proxy, to allow access only from the external load balancer and bastion instance
resource "aws_security_group" "nginx-sg" {
  name   = "nginx-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

   tags = merge(
    var.tags,
    {
      Name = "nginx-SG"
    },
  )
}

resource "aws_security_group_rule" "inbound-nginx-http" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ext-alb-sg.id
  security_group_id        = aws_security_group.nginx-sg.id
}

resource "aws_security_group_rule" "inbound-bastion-ssh" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion_sg.id
  security_group_id        = aws_security_group.nginx-sg.id
}


# security group for ialb, to have access only from nginx reverser proxy server
resource "aws_security_group" "int-alb-sg" {
  name   = "my-alb-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    {
      Name = "int-alb-sg"
    },
  )

}

resource "aws_security_group_rule" "inbound-ialb-https" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.nginx-sg.id
  security_group_id        = aws_security_group.int-alb-sg.id
}


# security group for webservers, to have access only from the internal load balancer and bastion instance
resource "aws_security_group" "webserver-sg" {
  name   = "my-asg-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    {
      Name = "webserver-sg"
    },
  )

}

resource "aws_security_group_rule" "inbound-web-https" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.int-alb-sg.id
  security_group_id        = aws_security_group.webserver-sg.id
}

resource "aws_security_group_rule" "inbound-web-ssh" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion_sg.id
  security_group_id        = aws_security_group.webserver-sg.id
}


# security group for datalayer to alow traffic from websever on nfs and mysql port and bastion host on mysql port
resource "aws_security_group" "datalayer-sg" {
  name   = "datalayer-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

 tags = merge(
    var.tags,
    {
      Name = "datalayer-sg"
    },
  )
}

resource "aws_security_group_rule" "inbound-nfs-port" {
  type                     = "ingress"
  from_port                = 2049
  to_port                  = 2049
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.webserver-sg.id
  security_group_id        = aws_security_group.datalayer-sg.id
}

resource "aws_security_group_rule" "inbound-mysql-bastion" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion_sg.id
  security_group_id        = aws_security_group.datalayer-sg.id
}

resource "aws_security_group_rule" "inbound-mysql-webserver" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.webserver-sg.id
  security_group_id        = aws_security_group.datalayer-sg.id
}
```
![Screenshot 2024-12-22 123832](https://github.com/user-attachments/assets/e9bcd633-24b0-486b-8e11-d6c20288a6da)

__`IMPORTANT NOTE`:__ We used the __`aws_security_group_rule`__ to reference another security group in a security group.


# 2. Create Certificate From Amazon Cerificate Manager (ACM)

### Create __`cert.tf`__ file and add the following code snippets to it.

__`NOTE`:__ Read through to change the domain name to your own domain name including any other name that needs to be changed.

```hcl
# The entire section creates a certificate, public zone, and validates the certificate using DNS method.

# Create the certificate using a wildcard for all the domains created in oyindamola.gq
resource "aws_acm_certificate" "oyindamola" {
  domain_name       = "*.oyindamola.gq"
  validation_method = "DNS"
}

# calling the hosted zone
data "aws_route53_zone" "oyindamola" {
  name         = "oyindamola.gq"
  private_zone = false
}

# selecting validation method
resource "aws_route53_record" "oyindamola" {
  for_each = {
    for dvo in aws_acm_certificate.oyindamola.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.oyindamola.zone_id
}

# validate the certificate through DNS method
resource "aws_acm_certificate_validation" "oyindamola" {
  certificate_arn         = aws_acm_certificate.oyindamola.arn
  validation_record_fqdns = [for record in aws_route53_record.oyindamola : record.fqdn]
}

# create records for tooling
resource "aws_route53_record" "tooling" {
  zone_id = data.aws_route53_zone.oyindamola.zone_id
  name    = "tooling.oyindamola.gq"
  type    = "A"

  alias {
    name                   = aws_lb.ext-alb.dns_name
    zone_id                = aws_lb.ext-alb.zone_id
    evaluate_target_health = true
  }
}


# create records for wordpress
resource "aws_route53_record" "wordpress" {
  zone_id = data.aws_route53_zone.oyindamola.zone_id
  name    = "wordpress.oyindamola.gq"
  type    = "A"

  alias {
    name                   = aws_lb.ext-alb.dns_name
    zone_id                = aws_lb.ext-alb.zone_id
    evaluate_target_health = true
  }
}
```
![Screenshot 2024-12-22 123723](https://github.com/user-attachments/assets/f4a6f7c2-2ced-4f11-ad3b-22f6080fea8d)
# 3. Create an external (Internet facing) Application Load Balancer (ALB)

### Create a file called `alb.tf`

First of all we will create the ALB, after which we create the target group and then, we create the lsitener rule.

Useful Terraform Documentation, go through this documentation and understand the arguement needed for each resources:

- [ALB](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb)
- [ALB-target](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group)
- [ALB-listener](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener)

We need to create an `ALB` to balance the traffic between the Instances:

```hcl
resource "aws_lb" "ext-alb" {
  name     = "ext-alb"
  internal = false
  security_groups = [
    aws_security_group.ext-alb-sg.id,
  ]

  subnets = [
    aws_subnet.public[0].id,
    aws_subnet.public[1].id
  ]

   tags = merge(
    var.tags,
    {
      Name = "ACS-ext-alb"
    },
  )

  ip_address_type    = "ipv4"
  load_balancer_type = "application"
}
```

### For the __`Internal Load balancer`__ we will follow the same concepts as with the external load balancer.

Add the code snippets inside the __`alb.tf`__ file

```hcl
# ----------------------------
#Internal Load Balancers for webservers
#---------------------------------

resource "aws_lb" "ialb" {
  name     = "ialb"
  internal = true
  security_groups = [
    aws_security_group.int-alb-sg.id,
  ]

  subnets = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]

  tags = merge(
    var.tags,
    {
      Name = "ACS-int-alb"
    },
  )

  ip_address_type    = "ipv4"
  load_balancer_type = "application"
}
```

### To inform our ALB where to route the traffic we need to create a [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html) to point to its targets:

```hcl
resource "aws_lb_target_group" "nginx-tgt" {
  health_check {
    interval            = 10
    path                = "/healthstatus"
    protocol            = "HTTPS"
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }
  name        = "nginx-tgt"
  port        = 443
  protocol    = "HTTPS"
  target_type = "instance"
  vpc_id      = aws_vpc.main.id
}
```

```hcl
# --- target group  for wordpress -------

resource "aws_lb_target_group" "wordpress-tgt" {
  health_check {
    interval            = 10
    path                = "/healthstatus"
    protocol            = "HTTPS"
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  name        = "wordpress-tgt"
  port        = 443
  protocol    = "HTTPS"
  target_type = "instance"
  vpc_id      = aws_vpc.main.id
}


# --- target group for tooling -------

resource "aws_lb_target_group" "tooling-tgt" {
  health_check {
    interval            = 10
    path                = "/healthstatus"
    protocol            = "HTTPS"
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  name        = "tooling-tgt"
  port        = 443
  protocol    = "HTTPS"
  target_type = "instance"
  vpc_id      = aws_vpc.main.id
}
```
### Then we will need to create a [Listner](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html) for this target group

```hcl
resource "aws_lb_listener" "nginx-listner" {
  load_balancer_arn = aws_lb.ext-alb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate_validation.fncloud.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.nginx-tgt.arn
  }
}
```
### For this aspect a single listener was created for the wordpress which is default, A rule was created to route traffic to tooling when the host header changes

```hcl
resource "aws_lb_listener" "web-listener" {
  load_balancer_arn = aws_lb.ialb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate_validation.fncloud.certificate_arn


  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.wordpress-tgt.arn
  }
}

# listener rule for tooling target

resource "aws_lb_listener_rule" "tooling-listener" {
  listener_arn = aws_lb_listener.web-listener.arn
  priority     = 99

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tooling-tgt.arn
  }

  condition {
    host_header {
      values = ["tooling.fncloud.dns-dynamic.net"]
    }
  }
}
```
![](./images/alb-code.png)

![](./images/targets.png)

![](./images/alb.png)

# Create an [Auto Scaling Group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) (ASG)

Now, we need to configure our `ASG` to be able to scale the EC2s in and out, depending on the application traffic.

Before we start configuring an ASG, we need to create the launch template and the the AMI needed. For now we are going to use a random AMI from AWS, then in `project 19`, we will use `Packer` to create our ami.

Based on the architecture we need for Auto Scaling groups for bastion, nginx, wordpress and tooling, we will create two files; __`asg-bastion-nginx.tf`__ will contain Launch Template and Austoscaling group for Bastion and Nginx, while __`asg-wordpress-tooling.tf`__ will contain Launch Template and Austoscaling group for wordpress and tooling.

Useful Terraform Documentation; Go through this documentation and understand the argument needed for each of the resources:

- [SNS-topic](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic)
- [SNS-notification](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_notification)
- [Austoscaling](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group)
- [Launch-template](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template)

### Create `asg-bastion-nginx.tf` and paste the code below;

```hcl
# creating sns topic for all the auto scaling groups
resource "aws_sns_topic" "david-sns" {
 name = "Default_CloudWatch_Alarms_Topic"
}


# creating notification for all the auto scaling groups
resource "aws_autoscaling_notification" "david_notifications" {
 group_names = [
   aws_autoscaling_group.bastion-asg.name,
   aws_autoscaling_group.nginx-asg.name,
   aws_autoscaling_group.wordpress-asg.name,
   aws_autoscaling_group.tooling-asg.name,
 ]
 notifications = [
   "autoscaling:EC2_INSTANCE_LAUNCH",
   "autoscaling:EC2_INSTANCE_TERMINATE",
   "autoscaling:EC2_INSTANCE_LAUNCH_ERROR",
   "autoscaling:EC2_INSTANCE_TERMINATE_ERROR",
 ]

 topic_arn = aws_sns_topic.david-sns.arn
}


resource "random_shuffle" "az_list" {
 input        = data.aws_availability_zones.available.names
}


# launch template for bastion

resource "aws_launch_template" "bastion-launch-template" {
 image_id               = var.ami
 instance_type          = "t2.micro"
 vpc_security_group_ids = [aws_security_group.bastion_sg.id]

 iam_instance_profile {
   name = aws_iam_instance_profile.ip.id
 }

 key_name = var.keypair

 placement {
   availability_zone = "random_shuffle.az_list.result"
 }

 lifecycle {
   create_before_destroy = true
 }

 tag_specifications {
   resource_type = "instance"

  tags = merge(
   var.tags,
   {
     Name = "bastion-launch-template"
   },
 )
 }

# create a file called bastion.sh and copy the bastion userdata from project 15 into it
 user_data = filebase64("${path.module}/bastion.sh")
}

# ---- Autoscaling for bastion  hosts


resource "aws_autoscaling_group" "bastion-asg" {
 name                      = "bastion-asg"
 max_size                  = 2
 min_size                  = 1
 health_check_grace_period = 300
 health_check_type         = "ELB"
 desired_capacity          = 1

 vpc_zone_identifier = [
   aws_subnet.public[0].id,
   aws_subnet.public[1].id
 ]


 launch_template {
   id      = aws_launch_template.bastion-launch-template.id
   version = "$Latest"
 }
 tag {
   key                 = "Name"
   value               = "bastion-launch-template"
   propagate_at_launch = true
 }

}


# launch template for nginx

resource "aws_launch_template" "nginx-launch-template" {
 image_id               = var.ami
 instance_type          = "t2.micro"
 vpc_security_group_ids = [aws_security_group.nginx-sg.id]

 iam_instance_profile {
   name = aws_iam_instance_profile.ip.id
 }

 key_name =  var.keypair

 placement {
   availability_zone = "random_shuffle.az_list.result"
 }

 lifecycle {
   create_before_destroy = true
 }

 tag_specifications {
   resource_type = "instance"

   tags = merge(
   var.tags,
   {
     Name = "nginx-launch-template"
   },
 )
 }

  # create a file called nginx.sh and copy the nginx userdata from project 15 into it
 user_data = filebase64("${path.module}/nginx.sh")
}


# ------ Autoscslaling group for reverse proxy nginx ---------

resource "aws_autoscaling_group" "nginx-asg" {
 name                      = "nginx-asg"
 max_size                  = 2
 min_size                  = 1
 health_check_grace_period = 300
 health_check_type         = "ELB"
 desired_capacity          = 1

 vpc_zone_identifier = [
   aws_subnet.public[0].id,
   aws_subnet.public[1].id
 ]

 launch_template {
   id      = aws_launch_template.nginx-launch-template.id
   version = "$Latest"
 }

 tag {
   key                 = "Name"
   value               = "nginx-launch-template"
   propagate_at_launch = true
 }


}

# attaching autoscaling group of nginx to external load balancer

resource "aws_autoscaling_attachment" "asg_attachment_nginx" {
 autoscaling_group_name = aws_autoscaling_group.nginx-asg.id
 alb_target_group_arn   = aws_lb_target_group.nginx-tgt.arn
}
```
![Screenshot 2024-12-22 123700](https://github.com/user-attachments/assets/237e1e18-ba87-4afa-9911-23ed9be2ef12)

### Create `asg-wordpress-tooling.tf` and paste the following code

```hcl
# launch template for wordpress

resource "aws_launch_template" "wordpress-launch-template" {
  image_id               = var.ami
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.webserver-sg.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.ip.id
  }

  key_name = var.keypair


  placement {
    availability_zone = "random_shuffle.az_list.result"
  }

  lifecycle {
    create_before_destroy = true
  }

  tag_specifications {
    resource_type = "instance"

    tags = merge(
    var.tags,
    {
      Name = "wordpress-launch-template"
    },
  )

  }

    # create a file called wordpress.sh and copy the wordpress userdata from project 15 into it.
  user_data = filebase64("${path.module}/wordpress.sh")
}


# ---- Autoscaling for wordpress application

resource "aws_autoscaling_group" "wordpress-asg" {
  name                      = "wordpress-asg"
  max_size                  = 2
  min_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "ELB"
  desired_capacity          = 1
  vpc_zone_identifier = [

    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]


  launch_template {
    id      = aws_launch_template.wordpress-launch-template.id
    version = "$Latest"
  }
  tag {
    key                 = "Name"
    value               = "wordpress-asg"
    propagate_at_launch = true
  }
}


# attaching autoscaling group of wordpress application to internal loadbalancer
resource "aws_autoscaling_attachment" "asg_attachment_wordpress" {
  autoscaling_group_name = aws_autoscaling_group.wordpress-asg.id
  alb_target_group_arn   = aws_lb_target_group.wordpress-tgt.arn
}


# launch template for tooling
resource "aws_launch_template" "tooling-launch-template" {
  image_id               = var.ami
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.webserver-sg.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.ip.id
  }

  key_name = var.keypair


  placement {
    availability_zone = "random_shuffle.az_list.result"
  }

  lifecycle {
    create_before_destroy = true
  }

  tag_specifications {
    resource_type = "instance"

  tags = merge(
    var.tags,
    {
      Name = "tooling-launch-template"
    },
  )

  }

  # create a file called tooling.sh and copy the tooling userdata from project 15 into it
  user_data = filebase64("${path.module}/tooling.sh")
}



# ---- Autoscaling for tooling -----

resource "aws_autoscaling_group" "tooling-asg" {
  name                      = "tooling-asg"
  max_size                  = 2
  min_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "ELB"
  desired_capacity          = 1

  vpc_zone_identifier = [

    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]

  launch_template {
    id      = aws_launch_template.tooling-launch-template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "tooling-launch-template"
    propagate_at_launch = true
  }
}

# attaching autoscaling group of  tooling application to internal loadbalancer
resource "aws_autoscaling_attachment" "asg_attachment_tooling" {
  autoscaling_group_name = aws_autoscaling_group.tooling-asg.id
  alb_target_group_arn   = aws_lb_target_group.tooling-tgt.arn
}
```
![](./images/asg-wp-tooling.png)

![](./images/ltp.png)

![](./images/asg.png)

![](./images/ec2.png)

# Storage and Database

Useful Terraform Documentation, go through this documentation and understand the arguement needed for each of the resources:

- [RDS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_subnet_group)
- [EFS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system)
- [KMS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kms_key)

# Create Elastic File System (EFS)

### In order to create an EFS we need to create a [KMS key](https://aws.amazon.com/kms/getting-started/).

AWS Key Management Service (KMS) makes it easy for you to create and manage cryptographic keys and control their use across a wide range of AWS services and also in your applications.

Add the following code to __`efs.tf`__

```hcl
# create key from key management system
resource "aws_kms_key" "fnc-kms" {
  description = "KMS key "
  policy      = <<EOF
  {
  "Version": "2012-10-17",
  "Id": "kms-key-policy",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::${var.account_no}:user/terraform" },
      "Action": "kms:*",
      "Resource": "*"
    }
  ]
}
EOF
}

# create key alias
resource "aws_kms_alias" "alias" {
  name          = "alias/kms"
  target_key_id = aws_kms_key.fnc-kms.key_id
}
```
### Let us create EFS and it's mount targets: Add the following code to __`efs.tf`__

```hcl
# create Elastic file system
resource "aws_efs_file_system" "fnc-efs" {
  encrypted  = true
  kms_key_id = aws_kms_key.fnc-kms.arn

  tags = merge(
    var.tags,
    {
      Name = "fnc-efs"
    },
  )
}

# set first mount target for the EFS
resource "aws_efs_mount_target" "subnet-1" {
  file_system_id  = aws_efs_file_system.fnc-efs.id
  subnet_id       = aws_subnet.private[2].id
  security_groups = [aws_security_group.datalayer-sg.id]
}


# set second mount target for the EFS
resource "aws_efs_mount_target" "subnet-2" {
  file_system_id  = aws_efs_file_system.fnc-efs.id
  subnet_id       = aws_subnet.private[3].id
  security_groups = [aws_security_group.datalayer-sg.id]
}

# create access point for wordpress
resource "aws_efs_access_point" "wordpress" {
  file_system_id = aws_efs_file_system.fnc-efs.id

  posix_user {
    gid = 0
    uid = 0
  }

  root_directory {
    path = "/wordpress"

    creation_info {
      owner_gid   = 0
      owner_uid   = 0
      permissions = 0755
    }

  }

}

# create access point for tooling
resource "aws_efs_access_point" "tooling" {
  file_system_id = aws_efs_file_system.fnc-efs.id
  posix_user {
    gid = 0
    uid = 0
  }

  root_directory {

    path = "/tooling"

    creation_info {
      owner_gid   = 0
      owner_uid   = 0
      permissions = 0755
    }

  }
}
```
![Screenshot 2024-12-22 123710](https://github.com/user-attachments/assets/447a0c32-9003-4202-8c63-f2ae1bfb33a3)

# Create MySQL RDS

### Let us create the RDS itself using this snippet of code in the __`rds.tf`__ file:

```hcl
# This section will create the subnet group for the RDS instance using the private subnet
resource "aws_db_subnet_group" "fnc-rds" {
  name       = "fnc-rds"
  subnet_ids = [aws_subnet.private[2].id, aws_subnet.private[3].id]

  tags = merge(
    var.tags,
    {
      Name = "fnc-rds"
    },
  )
}

# create the RDS instance with the subnets group
resource "aws_db_instance" "fnc-rds" {
  allocated_storage      = 50
  storage_type           = "gp3"
  engine                 = "mysql"
  engine_version         = "8.0.35"
  instance_class         = "db.t3.micro"
  db_name                = "francisdb"
  username               = var.master-username
  password               = var.master-password
  parameter_group_name   = "default.mysql8.0"
  db_subnet_group_name   = aws_db_subnet_group.fnc-rds.name
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.datalayer-sg.id]
  multi_az               = "true"
}
```
![Screenshot 2024-12-22 123812](https://github.com/user-attachments/assets/74a0fb6c-58eb-4702-b842-831b9820787f)

Before applying, please note that we gave reference to some variables in our resources that have not been declared in the __`variables.tf`__ file. Go through the entire code and spot these variables and declare them in the `variables.tf` file.

If we have done that well, our file should look like this one below.

```hcl
variable "region" {
  type = string
  description = "The region to deploy resources"
}

variable "vpc_cidr" {
  type = string
  description = "The VPC cidr"
}

variable "enable_dns_support" {
  type = bool
}

variable "enable_dns_hostnames" {
  dtype = bool
}

variable "enable_classiclink" {
  type = bool
}

variable "enable_classiclink_dns_support" {
  type = bool
}

variable "preferred_number_of_public_subnets" {
  type        = number
  description = "Number of public subnets"
}

variable "preferred_number_of_private_subnets" {
  type        = number
  description = "Number of private subnets"
}

variable "name" {
  type    = string
  default = "ACS"

}

variable "tags" {
  description = "A mapping of tags to assign to all resources."
  type        = map(string)
  default     = {}
}


variable "ami" {
  type        = string
  description = "AMI ID for the launch template"
}


variable "keypair" {
  type        = string
  description = "key pair for the instances"
}

variable "account_no" {
  type        = number
  description = "the account number"
}


variable "master-username" {
  type        = string
  description = "RDS admin username"
}

variable "master-password" {
  type        = string
  description = "RDS master password"
}
```
![Screenshot 2024-12-22 123901](https://github.com/user-attachments/assets/aa26477b-19a3-4064-bb24-fd80d724ccbd)

We are almost done but we need to update the last file which is `terraform.tfvars` file. In this file we are going to declare the values for the variables in our `varibales.tf` file.

Open the __`terraform.tfvars`__ file and add the code below:

```hcl
region = "us-east-1"

vpc_cidr = "172.16.0.0/16"

enable_dns_support = "true"

enable_dns_hostnames = "true"

enable_classiclink = "false"

enable_classiclink_dns_support = "false"

preferred_number_of_public_subnets = "2"

preferred_number_of_private_subnets = "4"

environment = "production"

ami = "ami-0b0af3577fe5e3532"

keypair = "devops"

# Ensure to change this to your acccount number
account_no = "123456789"


db-username = "francis"


db-password = "devopspbl"


tags = {
  Enviroment      = "production"
  Owner-Email     = "francis4fnc@gmail.com"
  Managed-By      = "terraform"
  Billing-Account = "1234567890"
}
```
![Screenshot 2024-12-22 123844](https://github.com/user-attachments/assets/0bb4d850-747a-40f8-a46d-34a6f70b23ca)


At this point, we shall have pretty much all the infrastructure elements ready to be deployed automatically. Let's try to __`plan`__ and __`apply`__ our Terraform codes, explore the resources in AWS console and make sure we destroy them right away to avoid massive costs.
![Screenshot 2024-12-22 123608](https://github.com/user-attachments/assets/29244d54-2f14-4138-ae37-b4c70c1668f7)
![Screenshot 2024-12-22 123139](https://github.com/user-attachments/assets/ca6c3af1-b416-4f82-8a86-90b39f0f6947)
![Screenshot 2024-12-22 123405](https://github.com/user-attachments/assets/bc6d1600-c258-46ef-8e39-0abc6004a120)
![Screenshot 2024-12-22 123413](https://github.com/user-attachments/assets/506f7fe0-211b-42bd-9ae1-77565254c2ba)
![Screenshot 2024-12-22 123427](https://github.com/user-attachments/assets/af39a375-5f57-4865-9135-59e0f2d3253d)
![Screenshot 2024-12-22 123433](https://github.com/user-attachments/assets/f643bdbf-d061-4a7b-98f4-8311dd1b566a)
![Screenshot 2024-12-22 123439](https://github.com/user-attachments/assets/527db1ad-3d03-4e29-860e-cbdd260872e0)
![Screenshot 2024-12-22 123444](https://github.com/user-attachments/assets/c39352a8-7bdf-4ab0-b903-20de31ce7777)
![Screenshot 2024-12-22 123450](https://github.com/user-attachments/assets/5ce27a03-2ab6-4905-a147-19505ba46ad4)
![Screenshot 2024-12-22 123456](https://github.com/user-attachments/assets/6e8e9aec-b02a-4169-972e-48c22fa9e5ad)
![Screenshot 2024-12-22 123506](https://github.com/user-attachments/assets/29d060ac-7bf4-4a53-b522-1aadc2cf148e)
![Screenshot 2024-12-22 123514](https://github.com/user-attachments/assets/ffb11ea7-ce3a-44c0-ac73-a7997f8c448f)
![Screenshot 2024-12-22 123522](https://github.com/user-attachments/assets/ea72c247-3f57-44e7-89a4-46c4033c186b)
![Screenshot 2024-12-22 123530](https://github.com/user-attachments/assets/9865ced8-96d5-4057-b138-db7904ac22fb)
![Screenshot 2024-12-22 123540](https://github.com/user-attachments/assets/c8c408e2-c6bc-490d-85cf-a694aa36b4aa)
![Screenshot 2024-12-22 123547](https://github.com/user-attachments/assets/748dd248-d4c2-4892-9327-bc0b525ac00a)
![Screenshot 2024-12-22 123556](https://github.com/user-attachments/assets/d51cf22e-e6b7-4fce-92ca-74d1313e3277)
![Screenshot 2024-12-22 123602](https://github.com/user-attachments/assets/e5559e50-bc5e-4eab-9160-9cd43e86b3b2)

![Screenshot 2024-12-22 131017](https://github.com/user-attachments/assets/08f6d96f-f9ee-406c-b3f0-839c0319f954)
![Screenshot 2024-12-22 132136](https://github.com/user-attachments/assets/f9a6d846-ec5c-4029-8a1c-6827f978e3e7)
![Screenshot 2024-12-22 131218](https://github.com/user-attachments/assets/24a76319-a9b5-424c-bcad-d9f2faac272c)
