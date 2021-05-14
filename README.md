# bch-tip-bot

Stable and efficient wallet backend powered by BCHD. Focus on building what you love, and leave re-inventing the wheel to us!

## Security

This is **not intended to be publicly facing software**, so it's highly recommended to set up a firewall to block external access to the port you have it running on.

**It's very important to remember that MongoDB does not come with any kind of security by default. If you do not properly secure it by blocking access to the MongoDB port or via other means you will lose 100% of user funds very quickly.**

When deciding what the :user_id should be, remember to use something that is static. Most games for example come with usernames and user ids (steamid, mojang uuid, etc). You should only make use of the latter unless none is available.

## Usage

### Wallet Creation

```
http://localhost:3000/:user_id/create
```

### Get Wallet Address

```
http://localhost:3000/:user_id/receive
```

### Get Wallet Balance

```
http://localhost:3000/:user_id/balance
```

### Send Bitcoin Cash

```
http://localhost:3000/:user_id/send/:address/:amount
```

## Installation

### Prerequisite

### Configuration

### Starting the app

### Securing the app

#### Install UFW

#### Allow SSH and essential ports

#### Block all ports