const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./frontEnd/js/app.js", // JS pour patient.html
    script: "./frontEnd/js/script.js", // JS pour docteur.html
  },
  output: {
    filename: "[name].bundle.js", // Générer un fichier par entrée
    path: path.resolve(__dirname, "dist"), // Dossier de sortie
    clean: true, // Nettoyer le dossier dist avant chaque build
  },
  devServer: {
    static: path.join(__dirname, "dist"), // Emplacement des fichiers générés
    port: 8080,
    open: true,
    historyApiFallback: true, // Gérer les erreurs 404 en redirigeant vers index.html
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Gestion des fichiers CSS
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Gestion des fichiers images
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]", // Les images vont dans dist/images
        },
      },
      {
        test: /\.json$/, // Gestion des fichiers JSON (par exemple, contract.json)
        type: "asset/resource",
        generator: {
          filename: "[name][ext]", // Copier le fichier JSON dans dist/
        },
      },
    ],
  },
  plugins: [
    // Générer les fichiers HTML
    new HtmlWebpackPlugin({
      template: "./frontEnd/index.html", // Source pour index.html
      filename: "index.html", // Nom du fichier généré
      chunks: [], // Aucun JS pour cette page
    }),
    new HtmlWebpackPlugin({
      template: "./frontEnd/patient.html", // Source pour patient.html
      filename: "patient.html",
      chunks: ["app"], // Inclure app.bundle.js
    }),
    new HtmlWebpackPlugin({
      template: "./frontEnd/docteur.html", // Source pour docteur.html
      filename: "docteur.html",
      chunks: ["script"], // Inclure script.bundle.js
    }),

    new HtmlWebpackPlugin({
        template: "./frontEnd/dme.html", // Source pour docteur.html
        filename: "dme.html",
        chunks: ["app"], // Inclure script.bundle.js
      }),
  
    // Extraire les fichiers CSS
    new MiniCssExtractPlugin({
      filename: "css/[name].css", // Les fichiers CSS vont dans dist/css
    }),

    // Copier d'autres fichiers comme contract.json
    new CopyWebpackPlugin({
      patterns: [
        { from: "artifacts/contracts/DMEContract.sol/DMEContract.json", to: "contract.json" }, // Copier contract.json dans dist/
      ],
    }),
  ],
};
