const vscode = require('vscode');
const mkdirp = require('mkdirp');
const fs = require('fs');
const _ = require('lodash');
const { createFile } = require('../commands/create_file');

async function flutterGetItNewModule(uri) {
    const featureName = await promptForFeatureName("FlutterGetIt Module name");
    if (featureName) {
        mkdirp(uri.fsPath + '/' + featureName);
        mkdirp(uri.fsPath + '/' + featureName+ '/' + 'module');
        mkdirp(uri.fsPath + '/' + featureName+ '/' + 'view');
        const baseUrl = uri.fsPath + '/' + featureName
        const baseUrlModule = uri.fsPath + '/' + featureName + '/' + 'module'
        const baseUrlView = uri.fsPath + '/' + featureName + '/' + 'view'
        const page = `${baseUrlView}/${featureName}_page.dart`;
        const fGetItModule = `${baseUrlModule}/${featureName}_module.dart`;
        const controller = `${baseUrlView}/${featureName}_controller.dart`;

        await createFile(page);
        await createFile(fGetItModule);
        await createFile(controller);

        const pageNameFile = _.upperFirst(_.camelCase(`${featureName}Page`));
        const moduleNameFile = _.upperFirst(_.camelCase(`${featureName}Module`));
        const controllerNameFile = _.upperFirst(_.camelCase(`${featureName}Controller`));

        fs.writeFileSync(page, `import 'package:flutter/material.dart';
import './${featureName}_controller.dart';

class ${pageNameFile} extends StatelessWidget {

    final ${controllerNameFile} _controller;

    const ${pageNameFile}({ 
        Key? key,
        required ${controllerNameFile} controller,
      }) : _controller = controller;

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(title: Text('${pageNameFile}'),),
            body: Container(),
        );
    }
}`, 'utf8');

        fs.writeFileSync(fGetItModule, `import 'package:flutter/material.dart';
import 'package:flutter_getit/flutter_getit.dart';
import '../view/${featureName}_controller.dart';
import '../view/${featureName}_page.dart';

class ${moduleNameFile} extends FlutterGetItModule {
    @override
    String get moduleRouteName => '${moduleNameFile}';
 
    @override
    List<Bind<Object>> get bindings => [
        Bind.lazySingleton(
            (i) => ${controllerNameFile}(),
        )
    ];

    @override
    Map<String, WidgetBuilder> get pages => {
        '${moduleNameFile}': (context) => ${controllerNameFile}(
              controller: context.get(),
            ),
      };
 
}`, 'utf8');

    fs.writeFileSync(controller, `import 'package:flutter_getit/flutter_getit.dart';

    class ${controllerNameFile} with FlutterGetItMixin {
      @override
      void dispose() {}
        
      @override
      void onInit() {}
    }
`, 'utf8');

        vscode.window.showInformationMessage('FlutterGetIt module created');
    }
}

function promptForFeatureName(prompt) {
	const FeatureNamePromptOptions = {
		prompt: prompt,
		placeHolder: "Module Name"
	};
	return vscode.window.showInputBox(FeatureNamePromptOptions);
}



module.exports = {flutterGetItNewModule};