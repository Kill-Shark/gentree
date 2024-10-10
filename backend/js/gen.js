/*
 * main.js
 */

import {GtDate} from "./gtdate.js"

import * as nd from "./node.js"
import {Node} from "./node.js"

import {Person} from "./person.js"

import {randint} from "./random.js"

import * as sym from "./sym.js"

import {Tree} from "./tree.js"

import {TarEntry, tar_load, tar_save} from "./tar.js"

export class Gen {
	constructor(data) {
		this.tar = []
		this.err = tar_load(this.tar, data)
		if (this.err)
			return

		for (let e in this.tar)
			if (this.tar[e].name == "data.json") {
				let data = new TextDecoder().decode(this.tar[e].data)
				this.events = JSON.parse(data)
				this.tar.splice(e, 1)
				break
			}

		if (this.events == undefined) {
			this.err = "No data.json found"
			return
		}

		// Resolve events
		for (let i = 0; i < this.events.length; i++) {
			let e = this.events[i]
			for (let k in e) {
				switch (k) {
				case sym.DATE:
					e[k] = new GtDate(e[k])
					break

				case sym.LATITUDE:
				case sym.LONGITUDE:
					e[k] = parseFloat(e[k])
					break

				case sym.SUBJECT:
				case sym.FATHER:
				case sym.MOTHER:
				case sym.HUSBAND:
				case sym.WIFE:
					e[k] = parseInt(e[k])
					break
				}
			}
		}

		// Parse people
		this.people = []
		for (let i = 0; i < this.events.length; i++) {
			let e = this.events[i]
			if (!(sym.TYPE in e)) {
				console.log("ERROR: No type field")

			} else {
				this.register(e, sym.SUBJECT)
				this.register(e, sym.FATHER)
				this.register(e, sym.MOTHER)
				this.register(e, sym.HUSBAND)
				this.register(e, sym.WIFE)
			}
		}

		for (let i = 0; i < this.people.length; i++) {
			let p = this.people[i]
			if (p != undefined) {
				p.tar = this.tar
				p.update()
			}
		}
	}

	register(e, role) {
		if (role in e) {
			let id = e[role]

			let person = this.people[id]
			if (person == undefined) {
				person = new Person(id)
				this.people[id] = person
			}

			e[role] = person
			person.add_event_raw(e)
		}
	}

	tree_get(type, w, h) {
		let tree = new Tree(this.people)

		tree.build(type, w, h)

		return tree
	}
}
