class ProjectCard {
  constructor(name) {
    this.name = name
    this.project = Project.data[name]

    /* Create HTML */

    const card =        Create("div", {c: "project-card"})
    const image =       Create("img", {a: `src=projects/${name}/project_card.png draggable=false`})
    const title =       Create("h2", {t: this.project.titleShort ?? this.project.title})
    const text =        Create("div", {c: "project-card--text"})
    const desc =        Create("div", {t: this.project.description, c: "project-card--description"})

    const button =      Create("button", {c: "button dark-1 project-card--button", t: "Prohlédnout"})
    const buttonArrow = Create("div", {c: "button-arrow"})

    const borderLeft =  Create("div", {c: "project-card--border-left"})
    const borderRight = Create("div", {c: "project-card--border-right"})
    const borderTop =   Create("div", {c: "project-card--border-top"})

    card.append(image, borderLeft, borderRight, borderTop, text)
    text.append(title, desc, button)
    button.append(buttonArrow)

    autoShy(desc)
    ProjectCard.placeCard(card)
  }
  static nextColumn = 1
  static placeCard(card) {
    Q(`.works--column-${ProjectCard.nextColumn}`).append(card)
    this.nextColumn = this.nextColumn === 1 ? 2 : 1 
  }
}