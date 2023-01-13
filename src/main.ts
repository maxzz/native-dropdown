import { ListIcons, listIcons, listItems } from './items';
import './doc.css';
import './style.css';

type UI = {
    dropdownTitleIcon: HTMLElement;
    dropdownTitle: HTMLElement;
    dropdownList: HTMLElement;
    mainButton: HTMLElement;
    floatingIcon: HTMLElement;
};

function dropDown(ui: UI, cssRoot: HTMLElement) {

    function iconTemplate(path: string) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="${path}" />
        </svg>
      `;
    }

    function setDropdownCssProps(deg: number, height: number, opacity: number) {
        const style = cssRoot.style;
        style.setProperty("--rotate-arrow", `${deg !== 0 ? deg + "deg" : 0}`);
        style.setProperty("--dropdown-height", `${height !== 0 ? height + "rem" : 0}`);
        style.setProperty("--list-opacity", `${opacity}`);
    }

    ui.mainButton.addEventListener("click", () => {
        const listWrapperSizes = 3.5; // margins, paddings & borders
        const dropdownOpenHeight = 4.6 * listItems.length + listWrapperSizes;
        const currDropdownHeight = cssRoot.style.getPropertyValue("--dropdown-height") || "0";

        currDropdownHeight === "0"
            ? setDropdownCssProps(180, dropdownOpenHeight, 1)
            : setDropdownCssProps(0, 0, 0);
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
        setDropdownCssProps(0, 0, 0);
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
}

function createDropdown(parent: HTMLElement) {
    const div = document.createElement('div');
    div.innerHTML = body();

    const root = div.querySelector<HTMLElement>('.dropdown-container')!;

    const ui: UI = {
        dropdownTitleIcon: root.querySelector(".dropdown-title-icon")!,
        dropdownTitle: root.querySelector(".dropdown-title")!,
        dropdownList: root.querySelector(".dropdown-list")!,
        mainButton: root.querySelector(".main-button")!,
        floatingIcon: root.querySelector(".floating-icon")!,
    };

    const cssRoot = root; //document.documentElement;

    renderListItems();
    dropDown(ui, cssRoot);

    return root;

    function renderListItems() {
        ui.dropdownList.innerHTML += listItems.map((item, index) => listItemTemplate(item, 100 * index)).join("");
    }

    function listItemTemplate(label: string, translateValue: number) {
        return `
        <li class="dropdown-list-item">
          <button class="dropdown-button list-button" data-translate-value="${translateValue}%">
            <span class="text-truncate">${label}</span>
          </button>
        </li>
      `;
    }

    function body() {
        return `
        <div class="dropdown-container">
        <button class="dropdown-button main-button">
          <span class="dropdown-title-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path
              d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg>
          </span>
          <span class="dropdown-title text-truncate">Facebook</span>
          <span class="dropdown-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </span>
        </button>
        <div class="dropdown-list-container">
          <div class="dropdown-list-wrapper">
            <ul class="dropdown-list"></ul>
            <div class="floating-icon" aria-hidden="true"></div>
          </div>
        </div>
      </div>
      `;
    }
}

window.addEventListener("load", () => {
    let nodes = [...document.querySelectorAll<HTMLElement>('.dropdown-place')];
    nodes.forEach((parent) => parent.parentElement!.replaceChild(createDropdown(parent), parent));
});
