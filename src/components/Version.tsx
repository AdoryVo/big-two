import { Link, Text, type TextProps, Tooltip } from '@chakra-ui/react';

export default function Version(props: TextProps) {
  return (
    <Tooltip hasArrow label="See changelog" placement="right" ms={2}>
      <Text
        position={['absolute', 'fixed']}
        bottom={0}
        left={0}
        m={[0, 4]}
        w={['100%', 'auto']}
        textAlign={['center', 'left']}
        {...props}
      >
        <Link
          href="https://github.com/AdoryVo/big-two/blob/main/CHANGELOG.md"
          isExternal
        >
          v1.0.2
        </Link>
      </Text>
    </Tooltip>
  );
}
