Since nginx 1.19 you can now use environment variables in your configuration with docker-compose. I used the following setup:

```
# file: docker/nginx/templates/default.conf.conf
upstream api-upstream {
    server ${API_HOST};
}


# file: docker-compose.yml
services:
    nginx:
        image: nginx:1.19-alpine
        volumes:
            - "./docker/nginx/templates:/etc/nginx/templates/"
        environment:
            NGINX_ENVSUBST_TEMPLATE_SUFFIX: ".conf"
            API_HOST: api.example.com

```

I'm going off script a little from the example in the documentation. Note the extra .conf extension on the template file - this is not a typo. In the docs for the nginx image it is suggested to name the file, for example, default.conf.template. Upon startup, a script will take that file, substitute the environment variables, and then output the file to /etc/nginx/conf.d/ with the original file name, dropping the .template suffix.

By default that suffix is .template, but this breaks syntax highlighting unless you configure your editor. Instead, I specified .conf as the template suffix. If you only name your file default.conf the result will be a file named /etc/nginx/conf.d/default and your site won't be served as expected.

https://stackoverflow.com/questions/56649582/substitute-environment-variables-in-nginx-config-from-docker-compose
