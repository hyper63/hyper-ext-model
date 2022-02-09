<h1 align="center">⚡️ hyper-ext-model ⚡️</h1>
<p align="center">A hyper-connect extension that specifies a generic model or entity for your application.</p>

> ⚠️ This project is !! experimental !! and is subject to change, we are building it in public to transfer knowledge and identify issues and concerns as we go through the journey of composing the hyper services.

---

## Table of Contents

- [Summary](#summary)
- [Install](#install)
- [Usage](#usage)
- [API](#api)

---

## Summary

hyper-ext-model is a hyper-connect extension that creates a model for your application connecting to the hyper service. For basic data structures hyper provides primitives to cache, search and notify services. Using this extension you can compose these services into a generic data model to define a given domain and provide basic business rules.

## Install

### NodeJS

```sh
npm install hyper-ext-model
```

### Deno

import_map.json

```json
{
  "imports": {
    "hyper-ext-model": "https://x.nest.land/hyper-ext-model@VERSON/bundle.js"
  }
}
```

## Usage

```js
import { connect } from 'hyper-ext-connect'
import { model } from 'hyper-ext-model'

const hyper = model(connect(process.env.HYPER))

const profiles = hyper.ext.model({
  name: 'profile',
  schema: profileSchema, // zod schema
  cache: true,
  search: ['name', 'email', 'username', 'phone'],
  count: true,
  notify: true,
  attachments: true,
  mode: 'non-atomic' 
  // modes 
  // atomic - auto rollback if action fails - 
  // non-atomic - (idempotent)
  // custom (provide interpreter/env)
})

// add or update a profile document
await profiles.upsert(id, doc)
// get a profile document by id
await profiles.get(id)
// remove a profile document
await profiles.remove(id)
// query profiles
await profiles.query(selector, options) // if selector is null, then pull list from cache
// full-text search
await profiles.search(criteria)
// total profiles
await profiles.count()
// sync material views (search, cache, and count)
// this function will rebalance counts, caches and search indexes 
// based on a checkpoint
await profiles.sync(checkpoint) // returns {ok: true, checkpoint: 'xxx'}

// add attachment
await profiles.addAttachment(modelId, attachmentName, stream)
// download attachment
await profiles.getAttachment(modelId, attachmentName) // returns stream
```


### Modes

The modes, provide basic composition workflows for each action.

- atomic - is all or nothing, kind of like a transaction is a relational database, if one operation fails, then the whole batch is rolled-back. it is possible the rollback fails and if it does, you may be in a partial state, but all operations will be idempotent which means that you can all the same action several times, and it will never create a duplicate document.
- non-atomic - this feature is the default and if a secondary index fails it will not rollback the whole transaction, but it will return a message letting the caller know which part of the transaction failed, and then the caller can determine if they would like to retry the transaction or report the error to the user.
- custom - this feature will allow the caller to specify an interpreter or env that instructs which operation mode at a granular level, for example, it may be something like this. modes: {cache: 'non-atomic', search: 'atomic', counter: 'atomic', queue: 'non-atomic'} - in this case, based on each operation the model flow will either behave in an atomic or non-atomic result.

## API

TBD


### Notify

if enabled, then `model` will generate a notifiation event using the queue service based on model:actions, and the `action, result, timestamp, and identifier` will be supplied in the notification. Then the receive of the notification can extract any data based on their access level to the model and hyper app in question. This is great to trigger emails, or sms messages based on a specific event.

### Attachments

if enabled, then the `model` can upload and download unstructured data files for a given model, this is great for models that have unstructured documents that accompany them.
