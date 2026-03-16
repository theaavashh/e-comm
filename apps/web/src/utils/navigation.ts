interface NavItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
  columns?: NavColumn[];
}

interface NavColumn {
  title: string;
  groups?: NavGroup[];
  items?: NavLink[];
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
}

const defaultNavigation: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    type: "link",
  },
  {
    id: "foods",
    label: "Foods",
    href: "/foods",
    type: "link",
  },
  {
    id: "carpets",
    label: "Carpets",
    href: "/products/carpet",
    type: "link",
  },
  {
    id: "statues",
    label: "Statues",
    href: "/products/statue",
    type: "link",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    href: "/products/jewellery",
    type: "link",
  },
  {
    id: "dresses",
    label: "Dresses",
    href: "/products/dress",
    type: "link",
  },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    type: "link",
  },
  {
    id: "brands",
    label: "Brands",
    href: "/brands",
    type: "link",
  },
];

export async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      return defaultNavigation;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/configuration/public/navigation`,
      { next: { revalidate: 3600 } }
    );

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (error) {
    console.error("Error fetching navigation:", error);
  }

  return defaultNavigation;
}
