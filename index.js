// GithubApi class is used for searching github and keeps all api logic within
class GithubApi {
  constructor() {
    this.baseUrl = 'https://api.github.com';
  }

  searchRepos(query) {
    // send out request to base url plus the search repositories with a param q thats set to our query, param q stands for query in the github docs.
    fetch(this.baseUrl + '/search/repositories?q=' + query)

    // we get a promise as a response and translate that response to json (javascript object notation)
    .then(resp => resp.json())

    // then we take the returns json and iterate through the items array in that json which represents our github repositories we had searched for
    .then(data => {
      data.items.forEach(repo => {
        // we create a new Github Repository for each item
        new GithubRepository(repo.name, repo.html_url, repo.forks, repo.owner);
      })
      // we use render all after the iteration so we can iterate and render all of the repos to the tbody
      GithubRepository.renderAll();
    })
  }
}

// GithubRepository is a class used to represent one repo, has static variables and functions to work with all repos
class GithubRepository {
  static all = [];

  constructor(name, url, forks, owner) {
    this.name = name;
    this.url = url;
    this.forks = forks;
    this.owner = owner;
    GithubRepository.all.push(this);
  }

  // renders to our tbody each tr that represents one repository
  render(i) {
    let tbody = document.querySelector('tbody');
    let html = `
    <tr>
      <td>${i + 1}</td>
      <td><a href="${this.url}" target="_blank">${this.name}</a></td>
      <td>${this.owner.login}</td>
      <td>${this.forks}</td>
    </tr>
    `
    tbody.innerHTML += html;
  }

  // clears our all array when about to show a new list of searched repositories
  static clearAll() {
    GithubRepository.all = [];
  }

  // used to render all of the repositories
  static renderAll() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    GithubRepository.all.forEach((repo, i) => {
      repo.render(i);
    })
  }
}

function searchGithub(e) {
  // prevent link from sending us to a refresh
  e.preventDefault();
  // find query value
  let query = document.querySelector('#query').value
  // delete all searched repositories
  GithubRepository.clearAll();
  // create a new github api instance
  let githubApi = new GithubApi();
  // call the search repos instance passing in our query
  githubApi.searchRepos(query);
}

window.addEventListener('load', function(){
  // add the searchGithub function as a listener for a submit of the form
  document.querySelector('form').addEventListener("submit", searchGithub)
})