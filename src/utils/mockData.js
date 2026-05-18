// Weighted random pick
function pick(items) {
  const total = items.reduce((s, i) => s + i.w, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.w
    if (r <= 0) return item.v
  }
  return items[items.length - 1].v
}

const COUNTRIES = [
  { v: 'India',          w: 25 }, { v: 'United States', w: 20 },
  { v: 'United Kingdom', w: 8  }, { v: 'Brazil',        w: 7  },
  { v: 'Canada',         w: 6  }, { v: 'Germany',       w: 5  },
  { v: 'Australia',      w: 5  }, { v: 'France',        w: 4  },
  { v: 'Singapore',      w: 4  }, { v: 'Japan',         w: 3  },
  { v: 'Netherlands',    w: 3  }, { v: 'Mexico',        w: 3  },
  { v: 'South Korea',    w: 3  }, { v: 'Other',         w: 4  },
]

const DEVICES = [
  { v: 'Mobile',  w: 60 },
  { v: 'Desktop', w: 30 },
  { v: 'Tablet',  w: 10 },
]

const SOURCES = [
  { v: 'Brand Launch Page', w: 40 },
  { v: 'Twitter / X',       w: 20 },
  { v: 'LinkedIn',          w: 15 },
  { v: 'Product Hunt',      w: 10 },
  { v: 'Instagram',         w: 8  },
  { v: 'Direct',            w: 5  },
  { v: 'Newsletter',        w: 2  },
]

const NAMES    = ['alex','sarah','mike','emma','john','lisa','david','anna','chris','jessica','james','olivia','ethan','sophia','noah','ava','liam','mia','lucas','grace']
const DOMAINS  = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','proton.me','me.com']

let _uidCounter = 1

function mockUser(daysAgo) {
  const now    = Date.now()
  const jitter = Math.random() * daysAgo * 24 * 60 * 60 * 1000
  const date   = new Date(now - jitter)
  const name   = NAMES[Math.floor(Math.random() * NAMES.length)]
  const num    = Math.floor(Math.random() * 9999)
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]

  return {
    id:        `mock-${_uidCounter++}`,
    email:     `${name}${num}@${domain}`,
    createdAt: date.toISOString(),
    source:    pick(SOURCES),
    country:   pick(COUNTRIES),
    device:    pick(DEVICES),
    status:    '1',
  }
}

export function generateMockData(count = 200) {
  const users = []
  for (let i = 0; i < count; i++) {
    // Exponentially more recent — gives realistic growth curve
    const daysAgo = Math.pow(Math.random(), 1.5) * 30
    users.push(mockUser(daysAgo))
  }
  return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function generateNewUsers(count = 1) {
  const users = []
  for (let i = 0; i < count; i++) {
    users.push(mockUser(0.02)) // within the last ~30 min
  }
  return users
}
