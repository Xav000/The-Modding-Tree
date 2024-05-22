console.log("Please Don't cheat, what about a cool challenge instead? There's an always invisible layer called 'Curium', It's never going to be used in the main game but let's see if you can make it visible")
addLayer("p", {
    name: "Gravity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#2B3C65",
    // --------------------------------

    // --------------------------------
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
        if (hasUpgrade('a', 11)) mult = mult.times(upgradeEffect('a', 11))
        if (hasUpgrade('a', 31)) mult = mult.times(10)
        //if (getBuyableAmount("a", 11).gte(1)) mult = mult.times(buyableEffect("a", 11))
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
    infoboxes: {
        lore: {
            title: "Your universe",
            body() { return "Your universe is currently" }, //(4 ⁄ 3) π r3
        },
    },
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
            tooltip: "Slowdown = 6",
            cost: new Decimal(10),
            effect() {
            if (hasUpgrade('p', 23))
                return player.points.add(1).log(4) + 1
            else
                return player.points.add(1).log(6) + 1

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x Gravity" }, // Add formatting to the effect
        },
        21: {
            title: "Dark Matter Entropy",
            description: "Dark matter is getting more chaotic because of gravity, Cosmic matter gain is boosted by Gravity",
            tooltip: "Slowdown = 5",
            cost: new Decimal(20),
            effect() {
                return player[this.layer].points.add(1).log(5) + 1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x Cosmic Matter" }, // Add formatting to the effect
            unlocked() {return hasUpgrade("p",13) },
        },
        22: {
            title: "Heavy Dark Matter",
            description: "Dark Matter follows Cosmic matter's Gravity, Making more Cosmic matter enter your universe",
            tooltip: "Boosts Cosmic matter Based on Cosmic matter, S = 8",
            cost: new Decimal(40),
            effect() {
                return player.points.add(1).log(8) + 1
            },
            unlocked() {return hasUpgrade("p",21) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x Cosmic Matter" }, // Add formatting to the effect
        },
        23: {
            title: "Stronger Gravity",
            description: "Gives a bigger boost to gravity's Basics, allows you to make small cosmic bodies.",
            tooltip: "Slowdown = 4",
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
            tooltip: "2x Cosmic Matter, 2x Gravity, 2x Asteroids",
            cost: new Decimal(3000),
            unlocked() {return hasUpgrade("p",23) },
        },
        32: {
            title: "Universal heat",
            description: "The universal Expansion is generating Energy, Which is making cosmic matter move fast",
            tooltip: "10x Cosmic Matter, 0.7x Gravity",
            cost: new Decimal(7500),
            unlocked() {return hasUpgrade("p",31, "p",12) },
        },
        33: {
            title: "Radiation",
            description: "Unlocks Radiation, making cosmic matter move even faster",
            tooltip: "^1.1 Cosmic Matter",
            cost: new Decimal(30000),
            unlocked() {return hasUpgrade("a",21) && hasUpgrade("p", 32)},
        },
        41: {
            title: "Metals",
            description: "Cosmic Matter is now able to fuse into metals, which make asteroids way heavier",
            tooltip: "10x Asteroids, 'Astral mannerisms' Is better, Unlock an Asteroid Upgrade",
            cost: new Decimal(50000),
            unlocked() {return hasUpgrade("a",21) && hasUpgrade("p", 33)},
        },
        42: {
            title: "Eletronic Distribution",
            description: "Cosmic Matter is able to be modificated to generate more radiation",
            tooltip: "Unlock Asteroid Buyables",
            cost: new Decimal("5e6"),
            unlocked() {return hasUpgrade("a",21) && hasUpgrade("p", 41)},
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
        if (hasUpgrade('p', 31)) mult = mult.times(2)
        if (hasUpgrade('p', 41)) mult = mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Buy Max Asteroids", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        return hasUpgrade("p",23),hasUpgrade("a",11)
    },
    upgrades: {
        11: {
            title: "Astral Mannerisms",
            description: "Gravity And Cosmic Matter gets boosted by asteroid",
            tooltip: "Slowdown = 3, Useless at 1 Asteroid",
            effect() {
                if (hasUpgrade('p', 41))
                    return player[this.layer].points.log(2.5).add(1)
                else
                    return player[this.layer].points.log(3).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x Gravity and Cosmic Matter" }, // Add formatting to the effect
            cost: new Decimal(1),
        },
        21: {
            title: "Cosmical Engravings",
            description: "Read engravings on the surface of the asteroids, discovering new upgrades.",
            tooltip: "Unlocks 3 Gravity Upgrades",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade("a",11) },
        },
        31: {
            title: "Denser Asteroids",
            description: "Makes asteroids smaller, but attracting more gravity",
            tooltip: "10x Gravity, 0.7x Asteroids",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade("p",41),hasUpgrade("a",31) },
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(10).pow(x) },
            display() { return "Cost: " + this.cost()+" Asteroids" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade("a", 11)},
            title: "Bigger Asteroids",
            tooltip: "Multiplies Gravity by 1.1x, Multiplicative",
            effect() {
                return player
            },
        },
    }
})
