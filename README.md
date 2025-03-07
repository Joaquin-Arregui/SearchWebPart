# Search WebPart (SPFx + React)

This web part is designed to query and display “Deliverables” information in a SharePoint list, offering filters by Topic, Leader, and Project. Below are instructions on prerequisites, local development, production deployment, and how to add new Topics, Leaders, or Projects.

---

## 1. Prerequisites

1. **Node.js**
   - Ensure that your Node.js version meets the requirements in the project’s `package.json`. As of SPFx 1.18, Node 16.x (>=16.13.0 <17.0.0) or Node 18.x (>=18.17.1 <19.0.0) is typically required.
2. **Gulp**
   - Gulp is used for building, bundling, and packaging your web part. Install it globally if you haven’t already:
     ```
     npm install -g gulp
     ```
3. **SharePoint Online tenant**
   - You’ll need access to a SharePoint Online tenant where you have permissions to upload and manage apps in the App Catalog.
4. **Office 365 tenant App Catalog**
   - Your tenant should have an App Catalog site. This is where the `.sppkg` file (SharePoint package) will be uploaded.

---

## 2. Getting Started Locally

To work on and test the web part locally using the SharePoint Workbench or a hosted workbench:

1. **Clone the repository**  
   ```
   git clone <your-repository-url>
   cd <your-repository>
   ```

2. **Install dependencies**  
   ```
   npm install
   ```
   This installs all required packages listed in `package.json`.

3. **Build and bundle**  
   ```
   gulp build
   gulp bundle
   ```
   This creates the compiled output in the `./lib` directory.

4. **Serve locally (SharePoint Workbench)**  
   Run:
   ```
   gulp serve
   ```
   - By default, this will open the local SharePoint Workbench (if your version of SPFx still supports the local workbench) at `https://localhost:4321/temp/workbench.html`.
   - Alternatively, you can configure it to use the hosted workbench (at `https://<tenant>.sharepoint.com/_layouts/15/workbench.aspx`) by adjusting your `serve.json` configuration if needed.

---

## 3. Deployment to SharePoint Online

When you’re ready to deploy your web part to SharePoint Online so end users can add it to site pages:

1. **Update your `write-manifests.json` if needed**  
   - If you are serving assets from a CDN or from SharePoint itself, verify that paths in your configuration are correct.

2. **Bundle and Package for Production**  
   Run the following in your project folder:
   ```
   gulp bundle --ship
   gulp package-solution --ship
   ```
   - This will create an `.sppkg` file in the `sharepoint/solution` folder (e.g., `./sharepoint/solution/web-part.sppkg`).

3. **Upload the `.sppkg` file to the App Catalog**
   - Go to your SharePoint Online App Catalog site (e.g., `https://<tenant>.sharepoint.com/sites/AppCatalog/`).
   - Upload the `.sppkg` file into the **Apps for SharePoint** document library.
   - When prompted, choose whether to make the solution available tenant-wide.

4. **Add the App to a Site**
   - Navigate to the **Site Contents** of the target site.
   - Click **Add an app** and locate your package in the list.
   - After it installs, you can add the web part to any SharePoint modern page.

---

## 4. Adding New Topics, Leaders, and Projects

The web part filters deliverables by **Topic**, **Leader**, and **Project**. In the current implementation (as seen in the code snippet in `SearchWebPart.tsx`), these values come from arrays of dropdown options and corresponding color mappings. To add new ones:

1. **Extend the dropdown options**  
   In `SearchWebPart.tsx`, you will see something like:
   ```ts
   const topicOptions: IDropdownOption[] = [
     { key: '', text: 'Select Topic' },
     { key: 'Management', text: 'Management' },
     { key: 'Campus', text: 'Campus' },
     // ...
   ];
   ```
   Add a new entry to these arrays with the appropriate `key` and `text` for your new Topic, Leader, or Project, for example:
   ```ts
   // Topics
   { key: 'NewTopic', text: 'NewTopic' }
   
   // Leaders
   { key: 'NewLeader', text: 'NewLeader' }
   
   // Projects
   { key: 'NewProject', text: 'NewProject' }
   ```

2. **Add the corresponding color mapping** (Optional)  
   If you want custom colors for badges, find the relevant color mapping object. For example, for Topics:
   ```ts
   const topicColors: { [key: string]: string } = {
     'Management': '#d4e7f6',
     'Campus': '#caf0cc',
     // ...
   };
   ```
   Add a new line for your new option:
   ```ts
   'NewTopic': '#ff0000',
   ```
   Do the same for the letter (foreground) color if needed:
   ```ts
   const topicLetterColors: { [key: string]: string } = {
     'Management': '#007ace',
     'Campus': '#437406',
     // ...
     'NewTopic': '#ffffff',
   };
   ```

3. **Update the corresponding SharePoint list or column**  
   - If you want to store these new Topics, Leaders, or Projects, ensure your **Deliverables** SharePoint list (or whichever list is used) has the updated values available. For example, if you’re using a **Choice** column for Topics, add “NewTopic” as an allowed value in the list settings.
   - If it’s a managed metadata or multi-select taxonomy field, ensure the new terms exist in the term store.

4. **Rebuild and redeploy**  
   After making changes:
   - Re-run `gulp build` and `gulp bundle --ship`.
   - Then update your package with `gulp package-solution --ship` and replace the `.sppkg` file in the App Catalog.

Once these steps are completed, your new Topic/Leader/Project will appear in the dropdown and be recognized by the search filters.

---

## 5. Additional Notes

- **SP PnP**: The project leverages `@pnp/sp` for SharePoint REST interactions. If you need deeper customizations (e.g., advanced queries or item updates), you can extend the `sp` calls in `SearchWebPart.tsx`.
- **Office UI Fabric / Fluent UI**: The user interface uses Fabric/Fluent UI components such as `SearchBox` and `Dropdown`. For deeper styling, refer to the Fluent UI documentation.
- **Permissions**: Make sure your users have at least **read** access to the underlying list. If they cannot see items in the search results, it could be a permissions issue.

---

**Author**: Joaquín Arregui Díaz