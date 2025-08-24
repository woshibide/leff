#!/usr/bin/env python3
import argparse
import re
import unicodedata
from pathlib import Path


def slugify(text: str) -> str:
    """
    convert text to url-safe slug, converting accented characters to basic latin equivalents
    
    args:
        text: the text to convert to a slug
        
    returns:
        str: url-safe slug with basic latin characters only
    """
    # normalize unicode characters to decomposed form (separate base chars from accents)
    text = unicodedata.normalize('NFD', text)
    # filter out combining characters (accents, diacritics) to get base latin characters
    text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')
    # convert to lowercase
    text = text.lower()
    # replace spaces and non-alphanumeric chars with hyphens
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # remove leading/trailing hyphens
    text = text.strip('-')
    return text


def normalize_folder_names(directory: str, recursive: bool = False, dry_run: bool = False) -> int:
    """
    normalize folder names in the given directory
    
    args:
        directory: path to the directory to process
        recursive: whether to process subdirectories recursively
        dry_run: if true, only show what would be renamed without actually renaming
    
    returns:
        int: number of folders renamed
    """
    dir_path = Path(directory)
    renamed_count = 0
    
    if not dir_path.exists():
        print(f"error: directory '{directory}' does not exist")
        return 0
    
    if not dir_path.is_dir():
        print(f"error: '{directory}' is not a directory")
        return 0
    
    try:
        # get all items in the directory
        items = list(dir_path.iterdir())
    except PermissionError as e:
        print(f"error accessing directory '{directory}': {e}")
        return 0
    
    # separate folders from files
    folders = [item for item in items if item.is_dir() and not item.name.startswith('.')]
    
    # process folders in current directory
    for folder in folders:
        original_name = folder.name
        normalized_name = slugify(original_name)
        
        if original_name != normalized_name:
            new_path = folder.parent / normalized_name
            
            # check if target name already exists
            if new_path.exists():
                print(f"warning: cannot rename '{original_name}' to '{normalized_name}' - target already exists")
                continue
            
            if dry_run:
                print(f"would rename: '{original_name}' -> '{normalized_name}'")
            else:
                try:
                    folder.rename(new_path)
                    print(f"renamed: '{original_name}' -> '{normalized_name}'")
                    renamed_count += 1
                except OSError as e:
                    print(f"error renaming '{original_name}': {e}")
        else:
            if not dry_run:
                print(f"skipping: '{original_name}' (already normalized)")
    
    # process subdirectories if recursive is enabled
    if recursive:
        # get updated list of folders after potential renames
        current_folders = [item for item in dir_path.iterdir() if item.is_dir() and not item.name.startswith('.')]
        
        for folder in current_folders:
            print(f"\nentering directory: {folder}")
            renamed_count += normalize_folder_names(str(folder), recursive=True, dry_run=dry_run)
    
    return renamed_count


def main():
    parser = argparse.ArgumentParser(
        description="normalize folder names by converting accented characters to basic latin equivalents and creating url-safe names"
    )
    parser.add_argument(
        "directory", 
        nargs="?", 
        default=".", 
        help="directory to process (default: current directory)"
    )
    parser.add_argument(
        "-r", "--recursive", 
        action="store_true", 
        help="process subdirectories recursively"
    )
    parser.add_argument(
        "-n", "--dry-run", 
        action="store_true", 
        help="show what would be renamed without actually renaming"
    )
    
    args = parser.parse_args()
    
    print(f"folder normalization starting...")
    print(f"  directory: {args.directory}")
    print(f"  recursive: {'yes' if args.recursive else 'no'}")
    print(f"  dry run: {'yes' if args.dry_run else 'no'}")
    print()
    
    if args.dry_run:
        print("DRY RUN MODE - no actual changes will be made")
        print()
    
    renamed_count = normalize_folder_names(args.directory, args.recursive, args.dry_run)
    
    print(f"\nfolder normalization completed.")
    if args.dry_run:
        print(f"would rename {renamed_count} folders")
    else:
        print(f"renamed {renamed_count} folders")


if __name__ == "__main__":
    main()
