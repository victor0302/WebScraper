import { getHTML } from "./crawl";

function main (){
    const args = process.argv.slice(2);
    if ((args.length) < 1) {
        console.error("error: missing base URL");
        process.exit(1)
    }
    else if ((args.length) > 1 ) {
        console.error ("error: too many base URLs");
        process.exit(1)
    }
    else{
        console.log(`starting at ${args[0]}`)
        process.exit(0)
    }


}

main();