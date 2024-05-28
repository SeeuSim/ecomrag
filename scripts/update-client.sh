curl -L -o pack.tgz https://ecomrag--development.gadget.app/api/client/tarball && \
  rm -rf .gadget/client && \
  tar -xf pack.tgz && \
  mv package .gadget/client && \
  rm -rf pack.tgz
