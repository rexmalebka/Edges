variable "do_token" {}

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_regions" "available" {
  filter {
    key = "available"
    values = ["true"]
  }
} 

resource "digitalocean_droplet" "webserver" {
  image  = "ubuntu-18-04-x64"
  name   = "webserver"
  region =  "nyc1"
  size   = "s-1vcpu-1gb"
  ssh_keys = ["27515542"]
}

resource "digitalocean_droplet" "streaming" {
  image  = "ubuntu-18-04-x64"
  name   = "streaming"
  region = "nyc1"
  size   = "s-1vcpu-1gb"
  ssh_keys = ["27515542"]
}

/*
        "ams2",
        "ams3",
        "blr1",
        "fra1",
        "lon1",
        "nyc1",
        "nyc2",
        "nyc3",
        "sfo1",
        "sfo2",
        "sfo3",
        "sgp1",
        "tor1"


*/

output "webserver_ip"{
  value = digitalocean_droplet.webserver.ipv4_address
}

output "streaming"{
  value = digitalocean_droplet.streaming.ipv4_address
}
