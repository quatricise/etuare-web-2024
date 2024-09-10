class ProjectCard {
  constructor(name) {
    this.name = name
    this.project = Project.data[name]

    /* Create HTML */

    const card =    Create("div", {c: "project-card"})

    const image =   Create("img", {a: `src=projects/${name}/project_card.png draggable=false`})

    const title =   Create("h2", {t: this.project.titleShort ?? this.project.title})

    const desc =    Create("div", {t: this.project.description, c: "project-card--description"})

    const button =  Create("button", {c: "button", t: "Prohlédnout"})

    const borderLeft = Create("div", {c: "project-card--border-left"})
    const borderTop = Create("div", {c: "project-card--border-top"})

    card.append(image, title, desc, button, borderLeft, borderTop)
    Q(`.works--column-${ProjectCard.nextColumn}`).append(card)
    ProjectCard.flipColumnPlacement()
  }
  static nextColumn = 1
  static flipColumnPlacement() {
    this.nextColumn = this.nextColumn === 1 ? 2 : 1 
  }
}