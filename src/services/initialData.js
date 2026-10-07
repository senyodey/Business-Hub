export const INITIAL_DATA = {
  business: {
    name: "My Tech Studio",
    tagline: "Apps & Web Development",
    currency: "GH₵",
    taxRate: 25, // Recommended tax withholding percentage
    fiscalYearStart: 1, // January
  },
  apps: [
    {
      id: "app-1",
      name: "TaskFlow SaaS",
      type: "Productivity Web App",
      activeUsers: 1420,
      monthlyPrice: 12,
      status: "Active",
      url: "https://taskflow.example.com",
      notes: "Monthly recurring subscriptions via Stripe",
      createdAt: "2025-08-15"
    },
    {
      id: "app-2",
      name: "PixelCraft AI",
      type: "AI Creative Suite",
      activeUsers: 3100,
      monthlyPrice: 19,
      status: "Active",
      url: "https://pixelcraft.example.com",
      notes: "Generates high margins; watch OpenAI API usage costs",
      createdAt: "2025-11-01"
    },
    {
      id: "app-3",
      name: "UptimePulse",
      type: "DevOps Monitoring",
      activeUsers: 480,
      monthlyPrice: 9,
      status: "Active",
      url: "https://uptimepulse.example.com",
      notes: "Low maintenance, steady organic growth",
      createdAt: "2026-01-10"
    }
  ],
  clients: [
    {
      id: "client-1",
      name: "Dr. Sarah Jenkins",
      company: "Horizon Dental Care",
      email: "sarah@horizondental.com",
      phone: "+1 (555) 234-5678",
      status: "Active",
      serviceType: "Custom Web Portal",
      budget: 6500,
      notes: "Custom patient booking portal. Phase 2 scheduled for next quarter.",
      createdAt: "2026-01-12"
    },
    {
      id: "client-2",
      name: "Mark Sterling",
      company: "Velocity Logistics",
      email: "mark@velocitylogistics.io",
      phone: "+1 (555) 876-5432",
      status: "Active",
      serviceType: "Fleet Tracking Dashboard",
      budget: 8000,
      notes: "Monthly maintenance retainer of $800 + feature upgrades.",
      createdAt: "2026-02-04"
    },
    {
      id: "client-3",
      name: "Elena Vance",
      company: "Bloom Botanicals",
      email: "elena@bloombotanicals.store",
      phone: "+1 (555) 432-1098",
      status: "Completed",
      serviceType: "E-Commerce Website",
      budget: 4500,
      notes: "High satisfaction. Recommended 2 new referrals.",
      createdAt: "2026-03-01"
    },
    {
      id: "client-4",
      name: "Arthur Pendelton",
      company: "Nexus Legal Group",
      email: "arthur@nexuslegal.law",
      phone: "+1 (555) 901-2345",
      status: "Lead",
      serviceType: "Law Firm Redesign & SEO",
      budget: 5200,
      notes: "Proposal sent last Tuesday. Waiting on contract signature.",
      createdAt: "2026-09-18"
    }
  ],
  transactions: [
    // 2026-07
    {
      id: "tx-1",
      date: "2026-07-05",
      type: "income",
      stream: "client",
      clientId: "client-1",
      sourceName: "Horizon Dental Care",
      category: "Client Milestone",
      amount: 3500,
      status: "Paid",
      description: "Frontend & Booking integration delivery"
    },
    {
      id: "tx-2",
      date: "2026-07-10",
      type: "income",
      stream: "app",
      appId: "app-1",
      sourceName: "TaskFlow SaaS",
      category: "App Subscription",
      amount: 1650,
      status: "Paid",
      description: "July Stripe payouts"
    },
    {
      id: "tx-3",
      date: "2026-07-12",
      type: "income",
      stream: "app",
      appId: "app-2",
      sourceName: "PixelCraft AI",
      category: "App Subscription",
      amount: 2100,
      status: "Paid",
      description: "July Pro & Credit packages"
    },
    {
      id: "tx-4",
      date: "2026-07-15",
      type: "expense",
      category: "Hosting & Cloud",
      amount: 240,
      status: "Paid",
      description: "AWS EC2 + S3 Storage invoice"
    },
    {
      id: "tx-5",
      date: "2026-07-16",
      type: "expense",
      category: "AI & APIs",
      amount: 410,
      status: "Paid",
      description: "OpenAI API usage for PixelCraft"
    },
    {
      id: "tx-6",
      date: "2026-07-20",
      type: "expense",
      category: "Software Tools",
      amount: 65,
      status: "Paid",
      description: "GitHub Team + Figma + Vercel Pro"
    },

    // 2026-08
    {
      id: "tx-7",
      date: "2026-08-04",
      type: "income",
      stream: "client",
      clientId: "client-2",
      sourceName: "Velocity Logistics",
      category: "Client Milestone",
      amount: 4000,
      status: "Paid",
      description: "Fleet tracking backend & websockets delivery"
    },
    {
      id: "tx-8",
      date: "2026-08-10",
      type: "income",
      stream: "app",
      appId: "app-1",
      sourceName: "TaskFlow SaaS",
      category: "App Subscription",
      amount: 1780,
      status: "Paid",
      description: "August Stripe payouts"
    },
    {
      id: "tx-9",
      date: "2026-08-12",
      type: "income",
      stream: "app",
      appId: "app-2",
      sourceName: "PixelCraft AI",
      category: "App Subscription",
      amount: 2350,
      status: "Paid",
      description: "August Pro plan renewals"
    },
    {
      id: "tx-10",
      date: "2026-08-14",
      type: "income",
      stream: "app",
      appId: "app-3",
      sourceName: "UptimePulse",
      category: "App Subscription",
      amount: 490,
      status: "Paid",
      description: "August subscriptions"
    },
    {
      id: "tx-11",
      date: "2026-08-15",
      type: "expense",
      category: "Hosting & Cloud",
      amount: 280,
      status: "Paid",
      description: "AWS & Supabase database charges"
    },
    {
      id: "tx-12",
      date: "2026-08-18",
      type: "expense",
      category: "AI & APIs",
      amount: 520,
      status: "Paid",
      description: "OpenAI & Anthropic API keys"
    },
    {
      id: "tx-13",
      date: "2026-08-25",
      type: "expense",
      category: "Marketing & Ads",
      amount: 350,
      status: "Paid",
      description: "Google Ads campaign for TaskFlow launch"
    },

    // 2026-09
    {
      id: "tx-14",
      date: "2026-09-02",
      type: "income",
      stream: "client",
      clientId: "client-3",
      sourceName: "Bloom Botanicals",
      category: "Client Milestone",
      amount: 4500,
      status: "Paid",
      description: "Complete Shopify store setup & custom code"
    },
    {
      id: "tx-15",
      date: "2026-09-05",
      type: "income",
      stream: "client",
      clientId: "client-2",
      sourceName: "Velocity Logistics",
      category: "Retainer",
      amount: 800,
      status: "Paid",
      description: "Monthly maintenance & bug fix retainer"
    },
    {
      id: "tx-16",
      date: "2026-09-10",
      type: "income",
      stream: "app",
      appId: "app-1",
      sourceName: "TaskFlow SaaS",
      category: "App Subscription",
      amount: 1950,
      status: "Paid",
      description: "September Stripe payout"
    },
    {
      id: "tx-17",
      date: "2026-09-12",
      type: "income",
      stream: "app",
      appId: "app-2",
      sourceName: "PixelCraft AI",
      category: "App Subscription",
      amount: 2550,
      status: "Paid",
      description: "September subscriptions"
    },
    {
      id: "tx-18",
      date: "2026-09-15",
      type: "expense",
      category: "Hosting & Cloud",
      amount: 295,
      status: "Paid",
      description: "AWS cloud compute & domain renewals"
    },
    {
      id: "tx-19",
      date: "2026-09-16",
      type: "expense",
      category: "AI & APIs",
      amount: 580,
      status: "Paid",
      description: "AI generation inference bills"
    },
    {
      id: "tx-20",
      date: "2026-09-22",
      type: "expense",
      category: "Contractors",
      amount: 1200,
      status: "Paid",
      description: "Freelance graphic designer for Bloom Botanicals brand kit"
    },

    // 2026-10 (Current Month)
    {
      id: "tx-21",
      date: "2026-10-02",
      type: "income",
      stream: "client",
      clientId: "client-1",
      sourceName: "Horizon Dental Care",
      category: "Client Milestone",
      amount: 3000,
      status: "Paid",
      description: "Phase 2 contract sign-on deposit"
    },
    {
      id: "tx-22",
      date: "2026-10-04",
      type: "income",
      stream: "client",
      clientId: "client-2",
      sourceName: "Velocity Logistics",
      category: "Retainer",
      amount: 800,
      status: "Paid",
      description: "October maintenance retainer"
    },
    {
      id: "tx-23",
      date: "2026-10-05",
      type: "income",
      stream: "app",
      appId: "app-1",
      sourceName: "TaskFlow SaaS",
      category: "App Subscription",
      amount: 2150,
      status: "Paid",
      description: "October Stripe MRR"
    },
    {
      id: "tx-24",
      date: "2026-10-06",
      type: "income",
      stream: "app",
      appId: "app-2",
      sourceName: "PixelCraft AI",
      category: "App Subscription",
      amount: 2700,
      status: "Paid",
      description: "October Pro plans"
    },
    {
      id: "tx-25",
      date: "2026-10-03",
      type: "expense",
      category: "Hosting & Cloud",
      amount: 310,
      status: "Paid",
      description: "AWS + Vercel + Supabase October billing"
    },
    {
      id: "tx-26",
      date: "2026-10-05",
      type: "expense",
      category: "AI & APIs",
      amount: 620,
      status: "Paid",
      description: "OpenAI GPT-4o & image model token usage"
    },
    {
      id: "tx-27",
      date: "2026-10-06",
      type: "expense",
      category: "Software Tools",
      amount: 145,
      status: "Paid",
      description: "GitHub, Postman, Cursor, Google Workspace"
    },
    // Outstanding / Pending invoice
    {
      id: "tx-28",
      date: "2026-10-07",
      type: "income",
      stream: "client",
      clientId: "client-4",
      sourceName: "Nexus Legal Group",
      category: "Client Milestone",
      amount: 2600,
      status: "Pending",
      description: "Initial retainer deposit (Invoice sent)"
    }
  ]
};
