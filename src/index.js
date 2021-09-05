const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function repositoryExists(request, response, next) {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex
  request.repository = repositories[repositoryIndex]
  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", repositoryExists, (request, response) => {
  const { title, url, techs } = request.body
  const { repository, repositoryIndex } = request

  const updatedRepository = { ...repository, title, url, techs };
  
  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  const { repository, repositoryIndex } = request

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { repository } = request

  console.log('Antes:', repository.likes)
  const likes = repository.likes + 1;

  repository.likes = likes;
  console.log('Depois:', repository.likes)

  return response.json(repository);
});

module.exports = app;
