import { EOL } from 'os';
import * as moment from 'moment';
import * as fs from 'fs';

import { getFileIndex } from './filename-utils';
import { yarleOptions } from './../yarle';

const TAG_SECTION_SEPARATOR = '---';

export const getMetadata = (note: any): string => {
  if (!yarleOptions.isMetadataNeeded) {
    return '';
  }

  return ''.concat(logSeparator())
            .concat(logCreationTime(note))
            .concat(logUpdateTime(note))
            .concat(logLatLong(note))
            .concat(logSeparator());

};

export const getTitle = (dstPath: string, note: any): string => {
    const index = getFileIndex(dstPath, note);
    if (index  === '') {
      return note['title']
           ? `# ${note['title']}${EOL}`
           : '';
    } else {
      return note['title']
             ? `# ${note['title']}.${index}${EOL}`
             : '';
    }
};

export const logCreationTime = (note: any): string => {
    return (!yarleOptions.skipCreationTime && note['created'])
           ? `    Created at: ${moment(note['created']).format()}${EOL}`
           : '';
  };

export const logUpdateTime = (note: any): string => {
  return (!yarleOptions.skipUpdateTime && note['updated'])
          ? `    Updated at: ${moment(note['updated']).format()}${EOL}`
          : '';
};

export const logLatLong = (note: any): string => {
  return (!yarleOptions.skipLocation && note['note-attributes'] && note['note-attributes']['longitude'])
          ? `    Where: ${note['note-attributes']['longitude']},${note['note-attributes']['latitude']}${EOL}`
          : '';
};

export const logTags = (note: any): string => {

  if (!yarleOptions.skipTags && note['tag']) {
    const tagArray = Array.isArray(note['tag']) ? note['tag'] : [note['tag']];
    const tags = tagArray.map((tag: string) => {
      const cleanTag = tag.replace(/ /g, '-');

      return cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
    });

    return `${EOL}${TAG_SECTION_SEPARATOR}${EOL}Tag(s): ${tags.join(' ')}${EOL}${EOL}${TAG_SECTION_SEPARATOR}${EOL}${EOL}`;
  }

  return '';
};

export const logSeparator = (): string => {
  return `${EOL}${EOL}`;
};

export const setFileDates = (path: string, note: any): void => {
  const modificationTime = moment(note['updated']);
  const mtime = modificationTime.valueOf() / 1000;
  fs.utimesSync(path, mtime, mtime);
};
