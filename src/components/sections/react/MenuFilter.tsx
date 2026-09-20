import { useState } from "react";
import { siteContent } from "../../../content/siteContent";

export default function MenuFilter() {
  const { menu } = siteContent;
  const [activeCategory, setActiveCategory] = useState<(typeof menu.categories)[number]>(
    menu.categories[0]
  );
  const filteredItems = menu.items.filter((item) => item.category === activeCategory);

  return (
    <div className="menu-paper">
      <div className="menu-paper-heading">
        <span aria-hidden="true">お品書き</span>
        <div className="menu-categories" aria-label="メニューの種類">
          {menu.categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <ul className="menu-list" aria-label={activeCategory}>
        {filteredItems.map((item) => (
          <li key={item.name} className="menu-entry">
            <div className="menu-entry-copy">
              <h3>{item.name}</h3>
              {"description" in item && <p>{item.description}</p>}
            </div>
            <span className="menu-price">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
