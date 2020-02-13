# Political Program Explorer

## Syncing data folder with Google Cloud Storage

### Install gsutil
```sh
curl https://sdk.cloud.google.com | bash
```
Restart your shell then init to login with you gcloud
account that has access to the bucket and save
your credentials
```sh
gcloud init
```

### Pull bucket to local data folder
```sh
./scripts/pull_data
```

### Push local data folder to bucket
```sh
./scripts/push_data
```
