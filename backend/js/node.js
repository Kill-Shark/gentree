/*
 * node.js
 */

import {randint} from "./random.js"

import * as sym from "./sym.js"

export const HEIGHT = 5

export class Node {
	constructor(person) {
		this.person = person
		this.y = person.get_y()

		this.clear()

		this.parents = []
		this.mates = []
		this.children = []

		this.tx = undefined
		this.ty = undefined
		this.rx = undefined
		this.ry = undefined

		this.root_x = undefined
		this.root_y = undefined
		this.root_tx = undefined
		this.root_ty = undefined

		this.hue = undefined

		this.connections = [false, false, false, false]
	}

	clear() {
		this.x = undefined
		this.spreaded = false
	}

	connect(nodes) {
		for (let i in this.person.parents)
			this.parents.push(nodes[this.person.parents[i].id - 1])

		for (let i in this.person.mates)
			this.mates.push(nodes[this.person.mates[i].id - 1])

		for (let i in this.person.children)
			this.children.push(nodes[this.person.children[i].id - 1])
	}

	rooting(nodes, w) {
		this.place_parents(nodes, w, true)
		for (let i in this.parents)
			this.parents[i].rooting(nodes, w)
	}

	spread(nodes, w) {
		if (this.spreaded)
			return

		this.place_parents(nodes, w)
		this.place_mates(nodes, w)
		this.place_children(nodes, w)

		this.spreaded = true

		for (let i in this.parents)
			this.parents[i].spread(nodes, w)

		for (let i in this.mates)
			this.mates[i].spread(nodes, w)

		for (let i in this.children)
			this.children[i].spread(nodes, w)
	}

	place_parents(nodes, w, offset=false) {
		for (let i in this.parents) {
			let p = this.parents[i]

			let x = this.x
			if (offset)
				x *= 2

			if (p.person.sex == sym.MALE) {
				p.place(nodes, w, x, -(w / 2))
			} else {
				p.place(nodes, w, x, w / 2)
			}
		}
	}

	place_mates(nodes, w) {
		let x = this.x + w
		let inc = w / 4.31
		if (this.person.sex == sym.FEMALE) {
			inc = -inc
			x = this.x - w
		}

		for (let i in this.mates)
			this.mates[i].place(nodes, w, x, inc)
	}

	place_children(nodes, w) {
		for (let i in this.children) {
			let mate = this.children[i].get_other_parent(this)

			let x = this.x
			if (mate != undefined)
				x = (this.x + mate.x) / 2
			x += randint(w * 2) - w

			this.children[i].place(nodes, w, x, 0)
		}
	}

	place(nodes, w, x, mx) {
		if (this.x != undefined)
			return

		this.x = x
		this.dodge(nodes, w, mx)
	}

	dodge(nodes, w, mx) {
		this.x += mx

		if (mx == 0)
			mx = w / 4.13

		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] == this || nodes[i].x == undefined)
				continue

			if (hit_test(this, nodes[i], w)) {
				this.x += mx
				i = -1
			}
		}
	}

	get_other_parent(p) {
		for (let i in this.parents)
			if (this.parents[i] != p)
				return this.parents[i]
	}

	get_root() {
		if (this.parents.length == 1) {
			this.parents[0].connections[2] = true

			this.root_x = this.parents[0].x
			this.root_y = this.parents[0].y + HEIGHT / 2.4

		} else if (this.parents.length == 2) {
			let fx = this.parents[0].x
			let fy = this.parents[0].y
			let mx = this.parents[1].x
			let my = this.parents[1].y

			this.root_x = (fx + mx) / 2
			this.root_y = (fy + my) / 2
		}
	}
}

function hit_test(a, b, w) {
	if (Math.abs(a.x - b.x) < w &&
		Math.abs(a.y - b.y) < HEIGHT) {
		return true
	}

	return false
}

function hit_test_point(node, w, px, py) {
	if (Math.abs(node.x - px) < w / 2 &&
		Math.abs(node.y - py) < HEIGHT / 2) {
		return true
	}

	return false
}
