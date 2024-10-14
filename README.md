# Soundromeda: Odyssey
For any issues or questions contact *@silveralcid* or *@Aadesh* on Discord.

## Versions




## Tech Stack

### Frontend

**Next.js** – <br>
Frontend framework for server-side rendering and static site generation <br>
```npm install next react react-dom```

**Tailwind** – <br>
Utility-first CSS framework for styling <br>
```npm install -D tailwindcss postcss autoprefixer```

**Shadcn** –<br>
UI components, continuously implement as needed (add to Dockerfile during implementation) <br>
```npm install shadcn-ui```<br>
```npx shadcn-ui init``` <br>
```npx shadcn-ui add [component]```<br><br>
Example: <br>
```npx shadcn-ui add alert-dialog```

**Telegram UI** – <br>
Official Telegram interface components <br>
```npm install npm i @telegram-apps/telegram-ui```

**React-Tinder-Card** <br>
– Handles swiping and card functionality for UI interactions <br>
```npm install react-tinder-card```

**React Spring** – <br>
JavaScript animation library, used for animations in conjunction with React-Tinder-Card  <br>
```npm install @react-spring/web```


### Backend and APIs

**Axios** – <br>
For making HTTP calls to APIs  <br>
```npm install axios```

**Telegram API** – <br>
Used for interacting with Telegram services

**Audius API** – <br>
API integration for music streaming, use SDK or fallback to API (no installation required)  



### Development Environment
**Node.js** – <br>
Required to install dependencies and run scripts via `npm`  

**TypeScript** – <br>
Primary language used for development  <br>
```npm install typescript @types/react @types/node```

**Docker** – <br>
Docker Desktop and VS Code plugin for containerization and setting up virtual development environments  


### Deployment
**Vercel** – <br>
Used for quick test deployments of the application

**Google Cloud Run** – <br>
Final deployment and host solution, not implemented yet.

**Telegram Desktop** - <br>
https://desktop.telegram.org/

## Dev Container Setup
It's highly preferred that you work out of the setup dev container for this project to avoid any local environment issues. 
<br><br>
**Please read the FAQ below for more information.**

### Important Notes
* ```.devcontainer.json``` defines the development environment, including the Docker image or Dockerfile to use, VS Code-specific settings (extensions, settings, commands), and how VS Code interacts with the container
* ```Dockerfile``` defines the base image, installation of software/tools, file structure, environment variables, and commands to be executed in the container
* Changes should only be made to the Dockerfile in ```.devcontainer``` at this time

### Requirements
[Visual Studio Code](https://code.visualstudio.com/download)<br>
[Docker for Desktop](https://www.docker.com/products/docker-desktop/)<br>
[Docker Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)<br>
[Dev Container Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)<br>




### Instructions
1. Install and setup requirements
2. Clone project repository locally and open it in VS Code
3. In the Command Palette (press F1 or Ctrl+Shift+P on Windows, Cmd+Shift+P on Mac), type "Remote-Containers: Reopen in Container" and select it.
4. VS Code should now rebuild the container and open it for development

![devcontainer-example (1)](https://github.com/user-attachments/assets/b636240e-5cc7-4e55-ba0b-b420e6781fd4)

### Optional Reading
[Docker in Visual Studio Code](https://code.visualstudio.com/docs/containers/overview) <br>
[Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers)<br>


## FAQ

### Dev Containers

**Do I have to use VS Code?**<br>
At this time, yes. 

**Do I have to use Dev Containers** <br>
Until we see issues, no. You can use whatever environment you wish, just keep in mind that only the dev container environment will be given support for this project.

**How do I push or commit with Dev Containers?** <br>
You will be doing this as usual, in the actual project folder, not the dev container.

**Why can’t I hot reload?**<br>
Hot reloading should not be an issue if your host OS is Linux or MacOS. <br>
If you're using Windows then [click this](https://stackoverflow.com/questions/54126848/why-nextjs-using-docker-container-did-not-reload-after-changed-code-for-dev-envi/77123014#77123014) for more information and a workaround.

**Why is there a Dockerfile in ```.devcontainer``` and another one in project root?** <br>
The Dockerfile in ```.devcontainer``` configures the **development** environment and the Dockerfile in ```root``` configures the **deployment** environment. Changes should only be made to the Dockerfile in ```.devcontainer``` at this time.

## Known Issues
### Dev Containers
**Hot Reloading not working for windows** <br>
[Click here for a workaround.](https://stackoverflow.com/questions/54126848/why-nextjs-using-docker-container-did-not-reload-after-changed-code-for-dev-envi/77123014#77123014) 

## 3rd Party Documentation
[Phaser + Next Template](https://github.com/phaserjs/template-nextjs) - This project is built off of this repository, which includes a Phaser to Next.js bridge.





