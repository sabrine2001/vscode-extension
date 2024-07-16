const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


function activate(context) {

  console.log('Félicitations, votre extension "my-extension" est maintenant active !');

  // Enregistrer la commande
  const disposable = vscode.commands.registerCommand('extension.comment', searchAndUpdateALFile);

  context.subscriptions.push(disposable);


}

function deactivate() {}

// Fonction de recherche et de mise à jour des fichiers XLF
async function searchAndUpdateALFile() {
  // Obtenir les fichiers XLF sélectionnés
  const selectedFiles = await vscode.window.showOpenDialog({
    // Add custom options for multi-selection
    canSelectMany: true,
  });
  
  if (!selectedFiles || selectedFiles.length === 0) {
    return;
  }

  // Obtenir la chaîne de caractères à rechercher
  const searchString = await vscode.window.showInputBox({
    prompt: "Entrez la chaîne de caractères à rechercher :",
    placeHolder: "Chaîne de caractères...",
  });

  if (!searchString) {
    return;
  }
 
  // Parcourir les fichiers sélectionnés
  for (const filePath of selectedFiles) {
    try {
      const fileContent = await readFile(filePath); // Read file content
      const matches = findMatches(fileContent, searchString); // Search for matches

      // Display message based on search results
      if (matches.length > 0) {
        const message = `La chaîne "${searchString}" a été trouvée dans le fichier "${path.basename(filePath.fsPath)}".`;
        vscode.window.showInformationMessage(message);
      } else {
        const message = `La chaîne "${searchString}" n'a pas été trouvée dans le fichier "${path.basename(filePath.fsPath)}".`;
        vscode.window.showInformationMessage(message);
        const window = vscode.window.createOutputChannel('dddddd');
        window.show();
        window.appendLine('a');
        window.clear();
      }
    } catch (error) {
      // Handle errors in reading or searching the file
      console.error(error);
      vscode.window.showErrorMessage(`Une erreur est survenue lors de la recherche dans le fichier "${path.basename(filePath.fsPath)}".`);
    }
  }
}

// Fonction de lecture d'un fichier
async function readFile(filePath) {
  const filePathString = filePath.fsPath; // Get the string path from Uri
  return new Promise((resolve, reject) => {
    fs.readFile(filePathString, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

// Fonction de recherche de correspondances dans le contenu d'un fichier
function findMatches(fileContent, searchString) {
  const regex = new RegExp(searchString, 'g');
  return fileContent.match(regex) || [];
}

module.exports = {
  activate,
  deactivate
};
