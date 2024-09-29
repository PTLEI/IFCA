import { useCallback, useMemo, useState } from "react";
import { Button, FormControl } from "react-bootstrap";

import { useBlocksData, useGlobalContext } from '@/context';
import { Badge } from "@/types/data";
import Icon from "@/utils/icon";
import { BADGES, SECTION_KEY } from "@/constant/general";

const BadgeItem: React.FC<{
  badge: Badge;
  selected: boolean;
  onSelect: (badge: Badge) => void;
}> = ({ badge, selected, onSelect }) => {
  const [hover, setHover] = useState(false);

  const { itemStyle, textStyle, iconStyle } = useMemo(() => {
    if (selected) {
      return {
        itemStyle: {
          backgroundColor: badge.color,
          color: "white",
          border: 0,
        },
        textStyle: {
          color: "white",
        },
      };
    } else if (hover) {
      return {
        itemStyle: {
          backgroundColor: "rgb(209, 213, 219)",
        },
        textStyle: {
          color: badge.color,
        },
      };
    }
    return { itemStyle: {}, textStyle: {}, iconStyle: {color: badge.color} };
  }, [selected, hover, badge.color]);

  return (
    <div
      className="flex items-center py-2 px-3 max-w-full rounded-full border border-gray-200 cursor-pointer select-none font-bold"
      style={{ ...itemStyle, ...textStyle }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={() => {
        onSelect(badge);
      }}
    >
      <Icon className='mr-2' style={iconStyle} icon={badge.icon} />
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {badge.name}
      </span>
    </div>
  );
};

export const AddBadges: React.FC = () => {
  const [search, setSearch] = useState('');
  const { blocks, updateBlocks } = useBlocksData();

  const badges = useMemo(() => {
    return blocks.badges || [];
  }, [blocks.badges]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const handleSelectBadge = (badge: Badge) => {
    if (badges && badges.includes(badge.name)) {
      updateBlocks({ badges: badges.filter((name) => name !== badge.name) });
    } else {
      updateBlocks({ badges: [...badges, badge.name] });
    }
  };

  return (
    <div className="p-3">
      <FormControl placeholder="Search Badge" onChange={handleSearch}/>
      <div className="flex flex-wrap gap-2 mt-3">
        {BADGES.filter((badge) => badge.name.toLowerCase().includes(search.toLowerCase())).map((badge) => (
          <BadgeItem
            key={badge.name}
            badge={badge}
            selected={badges.includes(badge.name)}
            onSelect={handleSelectBadge}
          />
        ))}
      </div>
    </div>
  );
};

const SelectedBadge: React.FC<{ badgeId: string }> = ({ badgeId }) => {
  const { blocks, updateBlocks } = useBlocksData();

  const badge = useMemo(() => {
    return BADGES.find((badge) => badge.name === badgeId);
  }, [badgeId]);

  const handleDeleteBadge = useCallback(() => {
    const badges = blocks.badges || [];
    updateBlocks({ badges: badges.filter((name) => name !== badgeId) });
  }, [blocks.badges, updateBlocks, badgeId]);

  if (!badge) return null;

  return (
    <div className="flex items-center h-20 p-3 border-b border-gray-200">
      <Icon className='mr-2 text-xl' icon='a-57' />
      <Icon className='w-10 h-10 mx-2 rounded-lg' style={{backgroundColor: badge.color, color: 'white'}} icon={badge.icon} />
      <div className='flex-1'>{badge.name}</div>
      <Icon className='ml-2 text-red-500' icon='delete' onClick={handleDeleteBadge}/>
    </div>
  );
};

const BadgesSettings: React.FC = () => {
  const { setEditingExtra } = useGlobalContext();
  const { blocks } = useBlocksData();

  const badgeIds = useMemo(() => {
    return blocks.badges || [];
  }, [blocks.badges]);

  const handleAddBadge = () => {
    setEditingExtra?.(SECTION_KEY.BADGES);
  }

  return (
    <div className="flex flex-col">
      <Button className="mt-4 mb-2 mx-3" variant="outline-secondary" onClick={handleAddBadge}>
        Add Badge
      </Button>
      {badgeIds.map((badgeId) => (
        <SelectedBadge key={badgeId} badgeId={badgeId} />
      ))}
    </div>
  );
};

export default BadgesSettings;
