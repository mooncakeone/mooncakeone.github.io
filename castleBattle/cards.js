let cards = [
  {
    id: 'pikemen',
    type: 'attack',
    title: 'Pikemen',
    description: '花费 1 <b>食物</b><br>造成 1 <b>伤害</b>',
    note: 'Send your disposable men to a certain death.',
    play (player, opponent) {
      player.food -= 1
      opponent.health -= 1
    },
  },
  {
    id: 'catapult',
    type: 'attack',
    title: 'Catapult',
    description: '花费 2 <b>食物</b><br>造成 2 <b>伤害</b>',
    play (player, opponent) {
      player.food -= 2
      opponent.health -= 2
    },
  },
  {
    id: 'trebuchet',
    type: 'attack',
    title: 'Trebuchet',
    description: '花费 3 <b>食物</b><br>自损 1 <b>生命值</b><br>造成 4 <b>伤害</b>',
    note: ' &#171;The finest machine Man ever created!&#187;',
    play (player, opponent) {
      player.food -= 3
      player.health -= 1
      opponent.health -= 4
    },
  },
  {
    id: 'archers',
    type: 'attack',
    title: 'Archers',
    description: '花费 3 <b>食物</b><br>造成 3 <b>伤害</b>',
    note: '&#171;Ready your bows! Nock! Mark! Draw! Loose!&#187;',
    play (player, opponent) {
      player.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'knighthood',
    type: 'attack',
    title: 'Knighthood',
    description: '花费 7 <b>食物</b><br>造成 5 <b>伤害</b>',
    note: 'Knights may be even more expansive than their mount.',
    play (player, opponent) {
      player.food -= 7
      opponent.health -= 5
    },
  },
  {
    id: 'repair',
    type: 'support',
    title: 'Repair',
    description: '恢复 5 <b>生命值</b><br>跳过你的下个回合',
    play (player, opponent) {
      player.skipTurn = true
      player.health += 5
    }
  },
  {
    id: 'quick-repair',
    type: 'support',
    title: 'Quick Repair',
    description: '花费 3 <b>食物</b><br>恢复 3 <b>生命值</b>',
    note: 'This is not without consequences on the moral and energy!',
    play (player, opponent) {
      player.food -= 3
      player.health += 3
    }
  },
  {
    id: 'farm',
    type: 'support',
    title: 'Farm',
    description: '获得 5 <b>食物</b><br>跳过你的下个回合',
    note: '&#171;One should be patient to grow crops.&#187;',
    play (player, opponent) {
      player.skipTurn = true
      player.food += 5
    },
  },
  {
    id: 'granary',
    type: 'support',
    title: 'Granary',
    description: '获得 2 <b>食物</b>',
    play (player, opponent) {
      player.food += 2
    }
  },
  {
    id: 'poison',
    type: 'special',
    title: 'Poison',
    description: '花费 1 <b>食物</b><br>你的对手失去 3 <b>食物</b>',
    note: 'Send someone you trust poison the enemy granary.',
    play (player, opponent) {
      player.food -= 1
      opponent.food -= 3
    },
  },
  {
    id: 'fireball',
    type: 'special',
    title: 'Fireball',
    description: '自损 3 <b>生命值</b><br>造成 5 <b>伤害</b><br>跳过你的回合',
    note: '&#171;Magic isn\'t for kids. You fool.&#187;',
    play (player, opponent) {
      player.health -= 3
      player.skipTurn = true
      opponent.health -= 5
    },
  },
  {
    id: 'chapel',
    type: 'special',
    title: 'Chapel',
    description: '嘿嘿...啥也干不了^_^',
    note: 'Pray in the chapel, and hope someone will listen.',
    play (player, opponent) {
      // Nothing happens...
    },
  },
  {
    id: 'curse',
    type: 'special',
    title: 'Curse',
    description: '双方:<br>失去 3 <b>食物</b><br>自损 3 <b>生命值</b>',
    play (player, opponent) {
      player.food -= 3
      player.health -= 3
      opponent.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'miracle',
    type: 'special',
    title: 'Miracle',
    description: '双方:<br>获得 3 <b>食物</b><br>恢复 3 <b>生命</b>',
    play (player, opponent) {
      player.food += 3
      player.health += 3
      opponent.food += 3
      opponent.health += 3
    },
  },
]

cards = cards.reduce((map, card) => {
  card.description = card.description.replace(/\d+\s+<b>.*?<\/b>/gi, '<span class="effect">$&</span>')
  card.description = card.description.replace(/<b>(.*?)<\/b>/gi, (match, p1) => {
    const id = p1.toLowerCase()
    return `<b class="keyword ${id}">${p1} <img src="svg/${id}.svg"/></b>`
  })
  map[card.id] = card
  return map
}, {})

let pile = {
  pikemen: 4,
  catapult: 4,
  trebuchet: 3,
  archers: 3,
  knighthood: 3,
  'quick-repair': 4,
  granary: 4,
  repair: 3,
  farm: 3,
  poison: 2,
  fireball: 2,
  chapel: 2,
  curse: 1,
  miracle: 1,
}
