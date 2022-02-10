<h1 align="center">⚡️ hyper-ext-model ⚡️</h1>
<p align="center">A hyper-connect extension that specifies a generic model or entity for your application.</p>

> ⚠️ This project is !!**experimental**!! and is subject to change. We are building it in public to transfer knowledge and identify issues and concerns as we go through the journey of composing the hyper services.

---

## Table of Contents

- [Summary](#summary)
- [Install](#install)
- [Usage](#usage)
- [API](#api)

---

## Summary

hyper-ext-model is a hyper-connect extension that creates a model for an application that uses the hyper service. For basic data structures, hyper provides primitives to cache, search, and notify services. Using this extension you can compose these services into a generic data model to define a given domain and provide basic business rules.

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

Modes provide basic composition workflows for each action:

- `atomic` - is all or nothing. Similar to a transaction is a relational database. If one operation fails, the whole batch is rolled back. It is possible the rollback fails. If it does, you may be in a partial state. But, all operations will be idempotent which means that you can all the same action several times, and it will never create a duplicate document.
- `non-atomic` - this feature is the default. A failure will not roll back the whole transaction, but it will return a message letting the caller know which part of the transaction failed. The caller can determine if they would like to retry the transaction or report the error to the user.
- `custom` - this feature allows the caller to specify an interpreter or env that instructs which operation mode at a granular level, For example: `modes: {cache: 'non-atomic', search: 'atomic', counter: 'atomic', queue: 'non-atomic'}` - in this case, based on each operation the model flow will either behave in an atomic or non-atomic result.

## API

TBD


### Notify

If enabled, the model will generate a notification event using the queue service based on the model actions. The `action`, `result`, `timestamp`, and `identifier` will be supplied in the notification.  The notification recipient can extract any data based on their access level to the model and hyper app in question. This is great to trigger emails or SMS messages based on a specific event.

### Attachments

Enabling attachments is useful in cases where models are accompanied by unstructured documents. If enabled, the model can upload and download unstructured data files for a given model. 
