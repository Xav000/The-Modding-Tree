addLayer("p", {
    name: "Gravity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#2B3C65",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Gravity", // Name of prestige currency
    baseResource: "Cosmic Matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 31)) mult = mult.times(2)
        if (hasUpgrade('p', 32)) mult = mult.times(0.7)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset Gravity Layer", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Dark Matter",
            description: "Something is making cosmic matter move around",
            tooltip: "Start gaining cosmic matter",
            cost: new Decimal(1),
        },
        12: {
            title: "Universal Expansion",
            description: "Dark Matter is Expanding the universe, catching more cosmic matter from the cosmos",
            tooltip: "Increase cosmic matter gain",
            cost: new Decimal(3),
        },
        13: {
            title: "Gravity's Basics",
            description: "Gravity now pulls things together, Gravity gain is boosted by Cosmic Matter",
            tooltip: "Exponent = 0.7",
            cost: new Decimal(10),
            effect() {
            if (hasUpgrade('p', 23))
                return player.points.add(1).pow(0.85)/1000 + 1
            else
                return player.points.add(1).pow(0.7)/1000 + 1

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "Dark Matter Entropy",
            description: "Dark matter is getting more chaotic because of gravity, Cosmic matter gain is boosted by Gravity",
            tooltip: "Diminishing Returns",
            cost: new Decimal(20),
            effect() {
                return player[this.layer].points.add(1).pow(0.8)/10 + 1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() {return hasUpgrade("p",13) },
        },
        22: {
            title: "Heavy Dark Matter",
            description: "Dark Matter follows Cosmic matter's Gravity, Making more Cosmic matter enter your universe",
            tooltip: "Boosts Cosmic matter Based on Cosmic matter",
            cost: new Decimal(40),
            effect() {
                return player.points.add(1).pow(0.1) + 1
            },
            unlocked() {return hasUpgrade("p",21) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Stronger Gravity",
            description: "Gives a bigger boost to gravity's Basics, allows you to make small cosmic bodies.",
            tooltip: "Exponent = 0.85",
            cost: new Decimal(70),
            unlocked() {return hasUpgrade("p",13) },
        },
        24: {
            title: "Cosmic Gravity",
            description: "Cosmic Matter in cosmos start being affected by the Universe's internal Gravity",
            tooltip: "3x Cosmic Matter",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade("p",23) },
        },
        31: {
            title: "Complex Cosmos",
            description: "Cosmic Matter is able to fuse and be more complicated now, generating new heavier materials",
            tooltip: "2x Cosmic Matter, 2x Gravity, 1.1x Asteroids",
            cost: new Decimal(3000),
            unlocked() {return hasUpgrade("p",23) },
        },
        32: {
            title: "Universal heat",
            description: "The universal Expansion is generating Energy, Which is making cosmic matter move fast",
            tooltip: "10x Cosmic Matter, 0.7x Gravity",
            cost: new Decimal(10000),
            unlocked() {return hasUpgrade("p",31, "p",12) },
        },
    },
})
addLayer("a", {
    name: "Asteroid", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#404040",
    requires: new Decimal("50000"), // Can be a function that takes requirement increases into account
    resource: "Asteroid", // Name of prestige currency
    baseResource: "Cosmic Matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 31)) mult = mult.add(1.1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Buy Max Asteroids", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("p",23) },
    upgrades: {
        11: {
            title: "Astral Mannerism",
            description: "Unlock Asteroid Buyables",
            tooltip: "Start gaining cosmic matter",
            cost: new Decimal(1),
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 Asteroid",
            effectDescription: "+50 Cosmic Matter/s",
            done() { return player.Asteroid = 1 }
        },
        2: {
            requirementDescription: "2 Asteroids",
            effectDescription: "+100 Cosmic Matter/s",
            done() { return player.Asteroid = 2 }
        },
        3: {
            requirementDescription: "3 Asteroids",
            effectDescription: "+150 Cosmic Matter/s",
            done() { return player.Asteroid = 3 }
        },
    }
})
