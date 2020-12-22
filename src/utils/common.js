const ora = require("ora");
const axios = require("axios");

const { promisify } = require("util");
let downloadGit = require("download-git-repo");
downloadGit = promisify(downloadGit); // 将项目下载到当前用户的临时文件夹下

const downloadDirectory = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.myTemplate`;

console.log('downloadDirectory:', downloadDirectory);

// 根据我们想要实现的功能配置执行动作，遍历产生对应的命令
const mapActions = {
  create: {
    alias: "c", //别名
    description: "创建一个项目", // 描述
    examples: [
      //用法
      "zoos-cli create <project-name>",
    ],
  },
  config: {
    //配置文件
    alias: "conf", //别名
    description: "config project variable", // 描述
    examples: [
      //用法
      "zoos-cli config set <k> <v>",
      "zoos-cli config get <k>",
    ],
  },
  "*": {
    alias: "", //别名
    description: "command not found", // 描述
    examples: [], //用法
  },
};

// 封装loading效果
const fnLoadingByOra = (fn, message) => async (...argv) => {
  console.log("argv1:", argv);
  const spinner = ora(message);
  spinner.start();
  let result = await fn(...argv);
  spinner.succeed(); // 结束loading
  return result;
};

//  获取仓库(repo)的版本号信息
const getTagLists = async (repo) => {
  const { data } = await axios.get(
    `https://api.github.com/repos/Jason-teams/${repo}/tags`
  );
  return data;
};

// 1).获取仓库列表
const fetchReopLists = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get(
    "https://api.github.com/orgs/Jason-teams/repos"
  );
  return data;
};




const downDir = async (repo, tag) => {
  console.log(tag, "downDir方法");
  let project = `Jason-teams/${repo}`; //下载的项目
  if (tag) {
    project += `#${tag}`;
  }
  //     c:/users/lee/.myTemplate
  let dest = `${downloadDirectory}/${repo}`;
  //把项目下载当对应的目录中
  console.log(dest, "dest的内容。。。。。。。。。。");
  console.log(project, "project的内容。。。。。。。。。。");
  try {
    await downloadGit(project, dest);
  } catch (error) {
    console.log("错误了吗？？？\n");
    console.log(error);
  }
  return dest;
};

module.exports = {
  downDir,
  mapActions,
  fnLoadingByOra,
  getTagLists,
  fetchReopLists,
  downloadDirectory,
};
