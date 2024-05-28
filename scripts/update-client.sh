curl -L -o pack.tgz https://ecomrag--development.gadget.app/api/client/tarball && \
  rm -rf .gadget/client/**/* && \
  tar -xf pack.tgz -C .gadget/client \
  && rm -rf pack.tgz
