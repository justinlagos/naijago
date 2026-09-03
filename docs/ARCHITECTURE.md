# NaijaGo platform architecture and journey map

This is the one-page map for product, design and engineering. Read it from top
to bottom: entry and discovery create intent; booking turns intent into a paid
pass; account and partner tools manage what happens after; platform services
make every client-side screen trustworthy. Solid arrows are user journeys.
Dotted arrows are service dependencies or moderation hand-offs.

```mermaid
flowchart TB
  ENTRY["Entry and app shell
  Web or installed PWA · responsive header · search
  mobile dock · footer · Powered by ionec
  offline shell cache · URL hash router"]

  subgraph DISCOVERY["Discover and plan"]
    HOME["Home  #/
    Swipeable hero · finder · seasons · weekend
    sponsored leaderboard · vibes · trust
    guides · field-kit book · hosts · story rail"]
    EXPLORE["Explore  #/explore
    Search result cards · save · sort
    desktop facets · mobile filter bottom sheet
    native sponsored card"]
    CALENDAR["Calendar  #/calendar
    Month navigation · date selection · filters
    calendar sponsor · selected-day results"]
    SEASONS["Season index and guide
    #/seasons · #/season/:id
    list · calendar · area views"]
    EDITORIAL["Editorial and trust
    #/guides · #/guide/:id
    #/hosts · #/host/:id · #/help"]
    DETAIL["Experience  #/experience/:id
    detail · timeline · facts · tiers
    quantity · save · availability · waitlist"]
  end

  subgraph COMMERCE["Book, pay and enter"]
    AUTH["Identity  #/login
    sign in · preserve intended action
    return to save, checkout or account"]
    CHECKOUT["Checkout  #/checkout
    10-minute inventory hold · tier and quantity
    card or transfer · fees · points · retry safety"]
    OUTCOME["Payment outcomes
    #/failed/:reason · #/confirmed
    declined · expired · timeout · cancelled
    receipt and booking reference"]
    PASS["Access and aftercare
    #/pass/:ref · #/gate/ok/:ref · #/gate/no/:ref
    offline QR · one-entry scan · used or void
    #/transfer/:ref · #/reschedule/:ref
    #/waitlist/:id · two-hour claim"]
  end

  subgraph ACCOUNT["Customer account"]
    ACCOUNTHOME["#/account
    points · next booking · quick actions"]
    ACCOUNTLIB["#/account/bookings · #/account/passes
    #/account/saved · #/account/plans
    booking history · cached passes · saved list
    itinerary and clash detection"]
    ACCOUNTPREFS["#/account/notifications · #/account/reviews
    #/account/settings
    read state · ratings · identity and preferences"]
  end

  subgraph PARTNER["Event partner console"]
    PARTNERHOME["#/partner
    sales · capacity · gross · commission
    payout forecast · weekly performance"]
    LISTINGS["#/partner/listings
    draft → in review → live
    sold, capacity and gross"]
    EDITOR["#/partner/listing
    details · JPG or PNG flyer upload
    1600×1200 guidance · live guest preview
    ticket pricing · draft or submit"]
    OPERATIONS["#/partner/payouts · #/partner/refunds
    #/partner/scanner
    48-hour settlement · refund ledger
    cached guest list · admit or reject"]
  end

  subgraph ADS["Advertising revenue flow"]
    INVENTORY["#/advertise
    inventory, dimensions, context and rates
    leaderboard · native · calendar · guide"]
    CAMPAIGN["#/advertise/create
    audience context · dates · budget · URL
    JPG or PNG creative upload · placement preview"]
    REVIEW["#/advertise/review
    platform-owner moderation
    brand fit · claims · dimensions · destination
    approve or return for changes"]
    ADPAY["#/advertise/payment
    approved inventory · card or bank transfer
    transaction and receipt"]
    ADLIVE["#/advertise/confirmed · #/advertise/campaigns
    schedule · serve · impressions · clicks
    spend · pause or complete · invoice"]
    PLACEMENTS["Clearly labelled live placements
    home 970×250 or 320×100
    explore native 1200×900
    calendar 728×90 or 320×100
    guide 1080×1350"]
  end

  subgraph PLATFORM["Production platform services"]
    CONTENT["CMS and media
    experiences · guides · hosts · ad creative
    image validation, safe crops and CDN"]
    INVENTORYPAY["Commerce and ledger
    inventory TTL · server price calculation
    payment webhooks · refunds · payouts
    idempotency and reconciliation"]
    TRUST["Trust and operations
    host verification · listing moderation
    ad-owner review · policy audit trail"]
    ACCESS["Access and messaging
    signed pass · offline gate list · scan sync
    email, push and in-app notifications"]
    INSIGHT["Analytics and reporting
    discovery funnel · conversion · attendance
    ad delivery, CTR and spend"]
  end

  ENTRY --> HOME
  HOME --> EXPLORE
  HOME --> CALENDAR
  HOME --> SEASONS
  HOME --> EDITORIAL
  EXPLORE --> DETAIL
  CALENDAR --> DETAIL
  SEASONS --> DETAIL
  EDITORIAL --> DETAIL
  DETAIL --> AUTH
  DETAIL --> CHECKOUT
  AUTH --> CHECKOUT
  CHECKOUT --> OUTCOME
  OUTCOME --> PASS
  OUTCOME --> ACCOUNTHOME
  PASS --> ACCOUNTLIB
  ACCOUNTHOME --> ACCOUNTLIB
  ACCOUNTHOME --> ACCOUNTPREFS

  ENTRY --> PARTNERHOME
  PARTNERHOME --> LISTINGS
  LISTINGS --> EDITOR
  EDITOR --> LISTINGS
  PARTNERHOME --> OPERATIONS

  ENTRY --> INVENTORY
  INVENTORY --> CAMPAIGN
  CAMPAIGN --> REVIEW
  REVIEW --> ADPAY
  ADPAY --> ADLIVE
  ADLIVE --> PLACEMENTS
  PLACEMENTS --> HOME
  PLACEMENTS --> EXPLORE
  PLACEMENTS --> CALENDAR
  PLACEMENTS --> EDITORIAL

  HOME -.-> CONTENT
  DETAIL -.-> CONTENT
  EDITOR -.-> CONTENT
  CHECKOUT -.-> INVENTORYPAY
  OUTCOME -.-> INVENTORYPAY
  OPERATIONS -.-> INVENTORYPAY
  EDITOR -.-> TRUST
  REVIEW -.-> TRUST
  PASS -.-> ACCESS
  ACCOUNTPREFS -.-> ACCESS
  EXPLORE -.-> INSIGHT
  OUTCOME -.-> INSIGHT
  ADLIVE -.-> INSIGHT

  classDef entry fill:#BF8422,color:#0A0A09,stroke:#0A0A09,stroke-width:2px;
  classDef screen fill:#FFFFFF,color:#0A0A09,stroke:#C9C7BC;
  classDef commerce fill:#0A0A09,color:#FFFFFF,stroke:#BF8422;
  classDef service fill:#EEE8DC,color:#0A0A09,stroke:#7B776D,stroke-dasharray:4 3;
  class ENTRY entry;
  class HOME,EXPLORE,CALENDAR,SEASONS,EDITORIAL,DETAIL,ACCOUNTHOME,ACCOUNTLIB,ACCOUNTPREFS,PARTNERHOME,LISTINGS,EDITOR,OPERATIONS,INVENTORY,CAMPAIGN,REVIEW,ADPAY,ADLIVE,PLACEMENTS screen;
  class AUTH,CHECKOUT,OUTCOME,PASS commerce;
  class CONTENT,INVENTORYPAY,TRUST,ACCESS,INSIGHT service;
```

## Implementation boundaries

- The prototype is client-side and in-memory; production must own inventory,
  prices, payment, pass signing, scan state, moderation and reporting on the
  server.
- Advertising payment occurs only after owner approval. A webhook—not the
  browser redirect—moves a campaign to paid and schedulable.
- Organic and paid ranking remain separate. Sponsored placements are explicit
  inventory slots and must retain the `Sponsored` or `Advertisement` label.
- The app shell can cache safely; personal and transactional responses require
  authenticated, scoped caching rules. A pass is cached at issuance.
