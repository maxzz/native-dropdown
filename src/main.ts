import { ListIcons, listIcons, listItems } from './items';
import './style.css';

const cssRoot = document.documentElement;

const ui = {
    dropdownTitleIcon: document.querySelector(".dropdown-title-icon")!,
    dropdownTitle: document.querySelector(".dropdown-title")!,
    dropdownList: document.querySelector(".dropdown-list") as HTMLElement,
    mainButton: document.querySelector(".main-button")!,
    floatingIcon: document.querySelector(".floating-icon")!,
};

const iconTemplate = (path: string) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="${path}" />
    </svg>
  `;
};

const listItemTemplate = (text: string, translateValue: number) => {
    return `
    <li class="dropdown-list-item">
      <button class="dropdown-button list-button" data-translate-value="${translateValue}%">
        <span class="text-truncate">${text}</span>
      </button>
    </li>
  `;
};

const setDropdownProps = (deg: number, height: number, opacity: number) => {
    const style = cssRoot.style;
    style.setProperty("--rotate-arrow", `${deg !== 0 ? deg + "deg" : 0}`);
    style.setProperty("--dropdown-height", `${height !== 0 ? height + "rem" : 0}`);
    style.setProperty("--list-opacity", `${opacity}`);
};

ui.mainButton.addEventListener("click", () => {
    const listWrapperSizes = 3.5; // margins, paddings & borders
    const dropdownOpenHeight = 4.6 * listItems.length + listWrapperSizes;
    const currDropdownHeight = cssRoot.style.getPropertyValue("--dropdown-height") || "0";

    currDropdownHeight === "0"
        ? setDropdownProps(180, dropdownOpenHeight, 1)
        : setDropdownProps(0, 0, 0);
});

ui.dropdownList.addEventListener("mouseover", (e) => {
    const translateValue = (e.target as HTMLElement).dataset.translateValue || '';
    cssRoot.style.setProperty("--translate-value", translateValue);
});

ui.dropdownList.addEventListener("click", (e) => {
    const clickedItemText = (e.target as HTMLElement).innerText.toLowerCase().trim() as ListIcons;
    const clickedItemIcon = listIcons[clickedItemText];

    ui.dropdownTitleIcon.innerHTML = iconTemplate(clickedItemIcon);
    ui.dropdownTitle.innerHTML = clickedItemText;
    setDropdownProps(0, 0, 0);
});

ui.dropdownList.addEventListener("mousemove", (e: MouseEvent) => {
    const iconSize = +cssRoot.style.getPropertyValue("--floating-icon-size") || 0;
    const x = e.clientX - ui.dropdownList.getBoundingClientRect().x;
    const y = e.clientY - ui.dropdownList.getBoundingClientRect().y;
    const targetText = (e.target as HTMLElement).innerText.toLowerCase().trim() as ListIcons;
    const hoverItemText = listIcons[targetText];

    ui.floatingIcon.innerHTML = iconTemplate(hoverItemText);
    cssRoot.style.setProperty("--floating-icon-left", x - iconSize / 2 + "px");
    cssRoot.style.setProperty("--floating-icon-top", y - iconSize / 2 + "px");
});

window.addEventListener("load", () => {
    renderListItems();

    function renderListItems() {
        ui.dropdownList.innerHTML += listItems.map((item, index) => listItemTemplate(item, 100 * index)).join("");
    }
});
