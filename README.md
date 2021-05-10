# bch-tip-bot

Simple backend for powering any number of on-chain Bitcoin Cash tipping bots.

## Security

This is generally **not intended to be publicly facing software**, so it's recommended to set up a firewall to block external access to the port you have it running on.

**It's very important to remember that MongoDB does not come with any kind of security by default. If you do not properly secure it by blocking access to the MongoDB port or via other means you will lose 100% of user funds very quickly.**

When deciding what the :user_id should be, remember to use something that is static. Most games for example come with usernames and user ids (steamid, mojang uuid, etc). You should only make use of the latter unless none is available.

## Usage

If you opt to disable user PINs through the .env file, you don't need to append anything to the end of the url. This isn't recommended unless you know what you're doing.

### Wallet Creation

``http://localhost:3000/:user_id/create/:secret_pin``

### Receive Bitcoin Cash

``http://localhost:3000/:user_id/receive``

### Send Bitcoin Cash

``http://localhost:3000/:user_id/send/:secret_pin/:secret_pin``

### Send Bitcoin Cash to another user

``http://localhost:3000/:user_id/send/:other_user_id/:secret_pin``

## Installation

### Prerequisite

### Configuration

### Starting the app

### Securing the app

#### Install UFW

#### Allow SSH and essential ports

#### Block all ports