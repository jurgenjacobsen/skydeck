# AGENTS.md
This document outlines the coding instructions and execution method for this codebase.

NEVER reference absolute local filesystem path routes (such as `C:\` or `file:///C:/`) in any documentation or code files (such as `.md` files). All paths must be relative to the root of the project. For example, if you need to reference a file in the `src` folder, use a relative path like `/src/file.ts` instead of an absolute path like `C:/Users/user1/Code/skydeck/src/file.ts`.

Not withstanding the instructions below, all code should be written in the most effective, clean and easy-to-maintain manner possible. You should avoid overly complex or overengineered solutions. Focus on writing the less to reach the desired functionality. The code should be well-documented, so the variables and functions should have concise and easy to understand names. 

When applicable a function should have a docstring (JSDoc) explaining its purpose, parameters, and return values. When a feature/functionality is too complex to be quickly understood you should generate documentation explaining the feature/functionality in detail and added to the /docs folders as an markdown file (follow the documentation instruction in this document). The code should be clean of bugs and throughly verified and tested to ensure maximum efficiency and functionality. 

**Project Priorities**
1. **Functionality**: The code should meet the functional requirements and objectives specified by the instructions or the PLAN. It should perform the intended tasks accurately and efficiently, without any errors or unexpected behavior. The code should be designed to handle edge cases and potential exceptions gracefully, ensuring that it remains robust and reliable under various conditions. Focus also on continuity, meaning that the UI/UX will be consistent and the user will not be confused by any changes in the UI/UX. The code should also be designed to be easily extensible and maintainable, allowing for future enhancements or modifications without requiring significant rework or refactoring.
2. **Performance**: The project is expected to have the highest performance possible within the UI/UX constraints. The code should be optimized for speed and efficiency, minimizing resource usage and maximizing responsiveness. This includes optimizing algorithms, data structures, and database queries to ensure that the application performs well even under high load or with large datasets. Additionally, the code should be designed to minimize latency and ensure that user interactions are smooth and responsive, providing a seamless experience for the end-users.
3. **UI**: After the first and second priorities are met, you should try to work on the UI (user) and at last on the developer code readibility.

## Coding Instructions
When prompted to execute any coding tasks, follow these instructions to ensure a smooth and efficient process:
1. **Understand the requirements**: Before starting any coding task, make sure you fully understand the requirements and objectives. If there are any ambiguities or uncertainties, seek clarification from the relevant stakeholders. Verify if the requested instructions fits within any 
2. **Understand the environment**: Familiarize yourself with the codebase in which you will be executing the PLAN. This includes understanding the structure of the code, the libraries being used, and any relevant documentation.
3. **Follow coding standards**: Adhere to the coding standards and best practices established for the codebase. This includes naming conventions, code formatting, and documentation requirements. If there are any specific guidelines or best practices mentioned in the codebase documentation, make sure to follow them.
4. **Write clean and maintainable code**: Strive to write code that is clean, readable, and maintainable.

## Documentation Instructions
When the AGENT runs the documentation for any implemented feature/functionality and it will write a document for the /docs folder it is supposed to follow this format:

```markdown
    ---
    name: <feature/functionality_name>
    short_description: <Concise description of the feature/functionality and its purpose.>
    type: <dev / user / both>
    last_updated: <Date and time of the last update to the document.>
    last_updated_by: <Name of the person who last updated the document.>
    last_version: <Version which the feature/functionality was last updated.>
    ---

    # Title of Feature/Functionality
    Concise description of the feature/functionality and its purpose.

    ## Detailed Explanation
    Provide a detailed explanation of the feature/functionality, including its components, how it works, and any relevant technical details. Use diagrams or code snippets if necessary to illustrate complex concepts.

    ## Usage Instructions
    Provide clear and concise instructions on how to use the feature/functionality. Include any necessary setup steps, configuration options, and examples of usage.

    ## Examples
    Provide examples of how to use the feature/functionality in different scenarios. Include code snippets, screenshots, or any other relevant materials to demonstrate its usage.

    ## Additional Information
    Include any additional information that may be relevant to the feature/functionality, such as known issues, limitations, or future enhancements. Provide links to related documentation or resources if applicable.

```


## PLAN.md Execution Method
When prompted to execute the PLAN provided execute the following steps:

1. **Understand the PLAN**: Carefully read and comprehend the PLAN provided. Ensure you understand each step and its purpose. If there are any unclear points, ask for clarification before proceeding.

2. **Understand the environment**: Familiarize yourself with the codebase in which you will be executing the PLAN. This includes understanding the structure of the code, the libraries being used, and any relevant documentation.

3. **Identify the tasks**: ONLY IF necessary break down the PLAN into individual steps. If no information provided in the prompt follow the plan the unchecked items/tasks in PLAN.md (from top to bottom). If provided in the prompt only execute the tasks as instructed.

4. **Task Management**: If a certain task is too long or complex, break it down into smaller sub-tasks, to avoid overwhelming the AGENT and compromising too much time into a single task. This will help in managing the workload effectively and ensure that each task is completed efficiently. Prioritize the tasks based on their importance and dependencies, and execute them in a logical order to maintain a smooth workflow.

5. **Seamless Changes**: The features/code changes to this codebase should try to follow the existing code style and structure whenever practicable. When adding new features or making changes, ensure that they integrate seamlessly with the existing codebase. Any deviation from the current code structure/style is welcome but should be prompted to the user to accept it before making the code change.

6. **Execute the tasks**: Start executing the tasks one by one. Ensure that you follow the instructions provided in the PLAN and adhere to any guidelines or constraints mentioned.

7. **Testing**: After executing each task, test the changes done to the code to ensure that they work as expected and do not introduce any new issues or bugs.

8. **Seek feedback**: After completing the tasks, seek feedback to ensure that the changes meet the requirements and expectations.

9. **Iterate and improve**: Based on the feedback received, make any necessary adjustments or improvements to the changes you have made. This may involve going back to previous steps and re-executing certain tasks to ensure that the final outcome is of high quality and meets the desired standards.

10. **Final Review**: Once all tasks are completed and feedback has been incorporated, conduct a final review of the changes to ensure that everything is in order and ready for deployment or integration into the main codebase.

11. **Log Changes**: Finally, log all the changes made during the execution of the PLAN or instructions in the CHANGELOG.md or change logs to maintain a record of the modifications for future reference. Check the checkboxes in the PLAN.md file for the tasks that have been completed. And also add the changes to the CHANGELOG.md file with a description of the changes made and the date of the change.

11. **Log Changes**: Log all changes made into the CHANGELOG.md file with a description of the changes made and the date of the change. The section of the document is based on the version number. As follows:
```markdown
    # [<version_number>]
    ## <date>
    ### Added
    - <Description of the new features or functionalities added.>

    ### Changed
    - <Description of the changes made to existing features or functionalities.>

    ### Fixed
    - <Description of the bugs or issues that were fixed.>

    ### Removed
    - <Description of the features or functionalities that were removed.>
```
(it should follow the order of the latest version on the start of the document and the oldest version at the end of the document.)

12. **Update Documentation**: If any new features or functionalities were added, or if there were significant changes to existing ones, update the relevant documentation in the /docs folder. Follow the documentation instructions provided in this document to ensure consistency and clarity.