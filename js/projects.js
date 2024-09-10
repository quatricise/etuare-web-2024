class Project {
  constructor() {
    
  }
  static testDataValidity() {

  }

  static open() {
    const project = new Project()

    this.openedProjects.set(name, project)
  }

  /** @type Map<string, Project> */
  static openedProjects = new Map()

  static data = {
    "adria_gold": {
      titleShort: "Adria Gold",
      title: "Test of project functionality",
      description: "Firma Henna vyrábí přírodní vlasovou kosmetiku z Henny. Dělali jsme redesign loga, design nových obalů a propagační materiály."
    }
  }
}