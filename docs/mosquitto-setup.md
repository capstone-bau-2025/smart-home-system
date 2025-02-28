
### mosquitto setup FOR LINUX
```bash
# install mosquitto on linux
sudo apt-get install mosquitto

# create control admin user and dynamic security json file
sudo mosquitto_ctrl dynsec init /etc/mosquitto/dynamic-security.json admin-central-hub central-hub-password

# set permissions of the dynamic security file
sudo chmod 666 dynamic-security.json

# restart mosquitto broker to appy changes
systemctl restart mosquitto

# in case we want to reset users, remove dynamic securty file and repeat the above steps
sudo rm /etc/mosquitto/dynamic-security.json
```

### mosquitto.conf file format
```
persistence true
persistence_location /var/lib/mosquitto/

log_dest file /var/log/mosquitto/mosquitto.log
include_dir /etc/mosquitto/conf.d

bind_address 0.0.0.0

allow_anonymous false

# Enable dynamic security
plugin /usr/lib/x86_64-linux-gnu/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynamic-security.json

```

### mqtt subscribe and publish discovery examples
```bash
# central-hub user can publish and subscribe to any topic at any level
mosquitto_sub -t "discovery/+" -u "central-hub" -P "central-hub-password" # subscribe to all discovery topics
mosquitto_pub -t "config/1234" -m "hello" -u "central-hub" -P "central-hub-password" # publish to config topic for specific device
# this way central-hub can be listening to any device that want to be discovered but send config to one device at a time.

# default-user can only subscribe to second level of config topic and publish to second level of discovery topic
# it should use its id as the second level of the topic ex. config/[device-id] or discovery/[device-id]
mosquitto_pub -t "discovery/1234" -m "hello" -u "default-user" -P "password"
mosquitto_sub -t "config/1234" -u "default-user" -P "password"
```

### testing dynamic security
```bash
# create a new user
mosquitto_ctrl -h localhost -u admin-central-hub -P central-hub-password dynsec createClient very-central-hub-test -p central-hub-password

# create a new role
mosquitto_ctrl -h localhost -u admin-central-hub -P central-hub-password dynsec createRole full-access-role

#add an acl rule to a role
mosquitto_ctrl -h localhost -u admin-central-hub -P central-hub-password dynsec addRoleACL full-access-role publishClientSend "#" allow

# assign role to a user
mosquitto_ctrl -h localhost -u admin-central-hub -P central-hub-password dynsec addClientRole central-hub full-access-role 10
```